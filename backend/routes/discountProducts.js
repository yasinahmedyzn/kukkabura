const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const DiscountProduct = require("../models/DiscountProducts");

const router = express.Router();

// Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "discountProducts",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

function normalizeCategory(body) {
  const raw = body["category[]"] ?? body.category;
  if (Array.isArray(raw)) return raw.map(s => String(s).trim()).filter(Boolean);
  if (typeof raw === "string") return raw.split(",").map(s => s.trim()).filter(Boolean);
  return [];
}

const upload = multer({ storage });

// -----------------------------
// CREATE DISCOUNT PRODUCT
// -----------------------------
router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "hoverImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { brand, name, price, discprice, thumbnailIndex } = req.body;
      const category = normalizeCategory(req.body);
      if (!category.length) return res.status(400).json({ message: "Category is required" });

      if (!req.files.images || !req.files.hoverImage) {
        return res.status(400).json({ message: "Product images and hover image are required" });
      }

      const images = req.files.images.map(file => ({
        url: file.path,
        publicId: file.filename,
      }));

      const hoverImageUrl = req.files.hoverImage[0].path;
      const hoverImagePublicId = req.files.hoverImage[0].filename;

      const product = new DiscountProduct({
        brand,
        name,
        price,
        discprice,
        category,
        images,
        thumbnailIndex: Number(thumbnailIndex) || 0,
        hoverImageUrl,
        hoverImagePublicId,
      });

      await product.save();
      res.status(201).json(product);
    } catch (err) {
      console.error("Error creating discount product:", err);
      res.status(500).json({ message: "Server error: " + err.message });
    }
  }
);

// -----------------------------
// GET ALL DISCOUNT PRODUCTS
// -----------------------------
router.get("/", async (req, res) => {
  try {
    const products = await DiscountProduct.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error fetching discount products:", err);
    res.status(500).json({ message: err.message });
  }
});

// -----------------------------
// DELETE DISCOUNT PRODUCT + IMAGES
// -----------------------------
router.delete("/:id", async (req, res) => {
  try {
    const product = await DiscountProduct.findById(req.params.id);
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

    // Delete from MongoDB
    await DiscountProduct.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted discount product and images successfully" });
  } catch (err) {
    console.error("Failed to delete discount product:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// -----------------------------------
// UPDATE PRODUCT (name, price, optional images)
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
        const product = await DiscountProduct.findById(req.params.id);
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
      const { name, price, discprice, brand, category, thumbnailIndex, deleteImagePublicId } = req.body;
      const product = await DiscountProduct.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const nextCategory = normalizeCategory(req.body);
      if (nextCategory.length) product.category = nextCategory;

      if (brand !== undefined) product.brand = brand;
      if (name !== undefined) product.name = name;
      if (price !== undefined) product.price = price;
      if (discprice !== undefined) product.discprice = discprice;
      if (category !== undefined) product.category = category;

      // Replace all images if new ones uploaded
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

      // Update thumbnail index
      if (thumbnailIndex !== undefined) {
        product.thumbnailIndex = Number(thumbnailIndex);
      }

      // Delete a single image if requested
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

      // Update hover image if new one uploaded
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
      console.error("Failed to update discount product:", err);
      res.status(500).json({ message: "Server error: " + err.message });
    }
  }
);


module.exports = router;
