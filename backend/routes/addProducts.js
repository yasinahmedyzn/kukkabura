const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const AddProduct = require("../models/AddProduct");

const router = express.Router();

// Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "addProducts",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

const upload = multer({ storage });

function normalizeCategory(body) {
  const raw = body["category[]"] ?? body.category;
  if (Array.isArray(raw)) return raw.map(s => String(s).trim()).filter(Boolean);
  if (typeof raw === "string") return raw.split(",").map(s => s.trim()).filter(Boolean);
  return [];
}

// -----------------------------------
// CREATE NEW Add PRODUCT
// -----------------------------------
router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "hoverImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { brand, name, price, thumbnailIndex } = req.body;
      const category = normalizeCategory(req.body);
      if (!category.length) return res.status(400).json({ message: "Category is required" });

      if (!req.files.images || !req.files.hoverImage) {
        return res.status(400).json({ message: "Product images and hover image are required" });
      }

      // Map all images to array
      const images = req.files.images.map(file => ({
        url: file.path,
        publicId: file.filename,
      }));

      const hoverImageUrl = req.files.hoverImage[0].path;
      const hoverImagePublicId = req.files.hoverImage[0].filename;

      const product = new AddProduct({
        brand,
        name,
        price,
        category,
        images,
        thumbnailIndex: Number(thumbnailIndex) || 0,
        hoverImageUrl,
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
// GET ALL Add PRODUCTS
// -----------------------------------
router.get("/", async (req, res) => {
  try {
    const products = await AddProduct.find().sort({ createdAt: -1 });
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
    const product = await AddProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete all product images from Cloudinary
    if (product.images && product.images.length) {
      for (const img of product.images) {
        await cloudinary.uploader.destroy(img.publicId);
      }
    }
    if (product.hoverImagePublicId) {
      await cloudinary.uploader.destroy(product.hoverImagePublicId);
    }

    await AddProduct.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted product and images successfully" });
  } catch (err) {
    console.error("Failed to delete product:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// -----------------------------------
// UPDATE PRODUCT (name, price, optional images, thumbnail, delete image)
// -----------------------------------
router.put(
  "/:id",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "hoverImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // If the request is JSON (no files), use req.body directly
      if (req.is('application/json')) {
        const { thumbnailIndex, deleteImagePublicId } = req.body;
        const product = await AddProduct.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Handle thumbnail change
        if (thumbnailIndex !== undefined) {
          product.thumbnailIndex = Number(thumbnailIndex);
        }

        // Handle image deletion
        if (deleteImagePublicId) {
          const idx = product.images.findIndex(img => img.publicId === deleteImagePublicId);
          if (idx !== -1) {
            await cloudinary.uploader.destroy(deleteImagePublicId);
            product.images.splice(idx, 1);
            // If deleted image was thumbnail, reset thumbnailIndex
            if (product.thumbnailIndex === idx) {
              product.thumbnailIndex = 0;
            } else if (product.thumbnailIndex > idx) {
              product.thumbnailIndex -= 1;
            }
          }
        }

        await product.save();
        return res.json(product);
      }

      // Otherwise, handle FormData (file uploads)
      const { name, price, brand, category, thumbnailIndex, deleteImagePublicId } = req.body;
      const product = await AddProduct.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const nextCategory = normalizeCategory(req.body);
      if (nextCategory.length) product.category = nextCategory;

      if (brand !== undefined) product.brand = brand;
      if (name !== undefined) product.name = name;
      if (price !== undefined) product.price = price;
      if (category !== undefined) product.category = category;

      if (req.files && req.files.images) {
        if (product.images && product.images.length) {
          for (const img of product.images) {
            await cloudinary.uploader.destroy(img.publicId);
          }
        }
        product.images = req.files.images.map(file => ({
          url: file.path,
          publicId: file.filename,
        }));
      }

      if (thumbnailIndex !== undefined) {
        product.thumbnailIndex = Number(thumbnailIndex);
      }

      if (deleteImagePublicId) {
        const idx = product.images.findIndex(img => img.publicId === deleteImagePublicId);
        if (idx !== -1) {
          await cloudinary.uploader.destroy(deleteImagePublicId);
          product.images.splice(idx, 1);
          if (product.thumbnailIndex === idx) {
            product.thumbnailIndex = 0;
          } else if (product.thumbnailIndex > idx) {
            product.thumbnailIndex -= 1;
          }
        }
      }

      if (req.files && req.files.hoverImage) {
        if (product.hoverImagePublicId) {
          await cloudinary.uploader.destroy(product.hoverImagePublicId);
        }
        product.hoverImageUrl = req.files.hoverImage[0].path;
        product.hoverImagePublicId = req.files.hoverImage[0].filename;
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