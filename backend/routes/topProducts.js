const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const TopProduct = require("../models/TopProduct");

const router = express.Router();

// Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "topProducts",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

const upload = multer({ storage });

// -----------------------------------
// CREATE NEW TOP PRODUCT
// -----------------------------------
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

      const product = new TopProduct({
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

// -----------------------------------
// GET ALL TOP PRODUCTS
// -----------------------------------
router.get("/", async (req, res) => {
  try {
    const products = await TopProduct.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: err.message });
  }
});

// -----------------------------------
// DELETE PRODUCT + IMAGES FROM CLOUDINARY
// -----------------------------------
router.delete("/:id", async (req, res) => {
  try {
    const product = await TopProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete images from Cloudinary
    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }
    if (product.hoverImagePublicId) {
      await cloudinary.uploader.destroy(product.hoverImagePublicId);
    }

    // Delete product from MongoDB
    await TopProduct.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted product and images successfully" });
  } catch (err) {
    console.error("Failed to delete product:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

module.exports = router;
