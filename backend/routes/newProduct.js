const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const NewProduct = require("../models/NewProduct");

const router = express.Router();

// Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "newProducts",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

const upload = multer({ storage });

// -----------------------------
// CREATE NEW PRODUCT
// -----------------------------
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "hoverImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { brand, name, price } = req.body;

      if (!req.files.image || !req.files.hoverImage) {
        return res.status(400).json({ message: "Both images are required" });
      }

      const imageUrl = req.files.image[0].path;
      const hoverImageUrl = req.files.hoverImage[0].path;
      const imagePublicId = req.files.image[0].filename;
      const hoverImagePublicId = req.files.hoverImage[0].filename;

      const product = new NewProduct({
        brand,
        name,
        price,
        imageUrl,
        hoverImageUrl,
        imagePublicId,
        hoverImagePublicId,
      });

      await product.save();
      res.status(201).json(product);
    } catch (err) {
      console.error("Error creating product:", err);
      res.status(500).json({ message: "Server error: " + err.message });
    }
  }
);

// -----------------------------
// GET ALL PRODUCTS
// -----------------------------
router.get("/", async (req, res) => {
  try {
    const products = await NewProduct.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: err.message });
  }
});

// -----------------------------
// DELETE PRODUCT + IMAGES FROM CLOUDINARY
// -----------------------------
router.delete("/:id", async (req, res) => {
  try {
    const product = await NewProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete images from Cloudinary
    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }
    if (product.hoverImagePublicId) {
      await cloudinary.uploader.destroy(product.hoverImagePublicId);
    }

    // Delete product from MongoDB
    await NewProduct.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted product and images successfully" });
  } catch (err) {
    console.error("Failed to delete product:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// -----------------------------------
// UPDATE PRODUCT (name, price, optional images)
// -----------------------------------
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "hoverImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, price, brand } = req.body; // include brand also
      const product = await TopProduct.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // ✅ Update basic fields only if provided
      if (brand !== undefined) product.brand = brand;
      if (name !== undefined) product.name = name;
      if (price !== undefined) product.price = price;

      // ✅ Update main image if new one uploaded
      if (req.files && req.files.image) {
        if (product.imagePublicId) {
          await cloudinary.uploader.destroy(product.imagePublicId);
        }
        const uploadedImage = await cloudinary.uploader.upload(
          req.files.image[0].path,
          { folder: "top-products" }
        );
        product.imageUrl = uploadedImage.secure_url;
        product.imagePublicId = uploadedImage.public_id;
      }

      // ✅ Update hover image if new one uploaded
      if (req.files && req.files.hoverImage) {
        if (product.hoverImagePublicId) {
          await cloudinary.uploader.destroy(product.hoverImagePublicId);
        }
        const uploadedHover = await cloudinary.uploader.upload(
          req.files.hoverImage[0].path,
          { folder: "top-products" }
        );
        product.hoverImageUrl = uploadedHover.secure_url;
        product.hoverImagePublicId = uploadedHover.public_id;
      }

      await product.save();
      res.json(product);
    } catch (err) {
      console.error("Failed to update product:", err);
      res.status(500).json({ message: "Server error: " + err.message });
    }
  }
);


module.exports = router;
