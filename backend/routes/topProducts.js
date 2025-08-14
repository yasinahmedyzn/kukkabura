const express = require("express");
const multer = require("multer");
const path = require("path");
const TopProduct = require("../models/TopProduct");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Create product
router.post("/", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "hoverImage", maxCount: 1 }
]), async (req, res) => {
  try {
    const { brand, name, price } = req.body;

    if (!req.files.image || !req.files.hoverImage) {
      return res.status(400).json({ message: "Both images are required" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.files.image[0].filename}`;
    const hoverImageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.files.hoverImage[0].filename}`;

    const product = new TopProduct({ brand, name, price, imageUrl, hoverImageUrl });
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await TopProduct.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    await TopProduct.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
