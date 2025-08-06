const express = require("express");
const router = express.Router();
const multer = require("multer");
const CarouselImage = require("../models/CarouselImage");
const path = require("path");
const fs = require("fs");

// Configure multer to store files in the /uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

/**
 * GET /api/carousel-images
 * Return array of image URLs (for frontend carousel use)
 */
router.get("/", async (req, res) => {
  try {
    const images = await CarouselImage.find();
    const urls = images.map((img) => img.url);
    res.json(urls);
  } catch (err) {
    console.error("Error fetching image URLs:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

/**
 * GET /api/carousel-images/all
 * Return array of {_id, url} objects (for admin dashboard)
 */
router.get("/all", async (req, res) => {
  try {
    const images = await CarouselImage.find();
    res.json(images); // Includes _id and url
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

/**
 * POST /api/carousel-images
 * Upload a new carousel image
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const newImage = new CarouselImage({ url: imageUrl });
    await newImage.save();

    res.status(201).json({ message: "Image uploaded", url: imageUrl });
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

/**
 * DELETE /api/carousel-images/:id
 * Delete an image by its MongoDB ID
 */
router.delete("/:id", async (req, res) => {
  try {
    const image = await CarouselImage.findById(req.params.id);
    if (!image) return res.status(404).json({ error: "Image not found" });

    // Extract filename from stored URL
    const filename = image.url.split("/uploads/")[1];
    const filePath = path.join(__dirname, "../uploads", filename);

    // Attempt to delete image file from disk
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file from disk:", err);
      }
    });

    // Remove image from database
    await CarouselImage.findByIdAndDelete(req.params.id);

    res.json({ message: "Image deleted" });
  } catch (err) {
    console.error("Error deleting image:", err);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

module.exports = router;
