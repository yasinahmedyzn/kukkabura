const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const CarouselImage = require("../models/CarouselImage");

// Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "carouselImages",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

const upload = multer({ storage });

// -----------------------------
// GET ALL IMAGE URLs FOR FRONTEND
// -----------------------------
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

// -----------------------------
// GET ALL IMAGES WITH _ID FOR ADMIN
// -----------------------------
router.get("/all", async (req, res) => {
  try {
    const images = await CarouselImage.find();
    res.json(images); // Includes _id, url, publicId
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

// -----------------------------
// UPLOAD NEW CAROUSEL IMAGE
// -----------------------------
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const imageUrl = req.file.path;           // Cloudinary URL
    const imagePublicId = req.file.filename;  // Cloudinary public_id

    const newImage = new CarouselImage({ url: imageUrl, publicId: imagePublicId });
    await newImage.save();

    res.status(201).json({ message: "Image uploaded", url: imageUrl });
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// -----------------------------
// DELETE CAROUSEL IMAGE
// -----------------------------
router.delete("/:id", async (req, res) => {
  try {
    const image = await CarouselImage.findById(req.params.id);
    if (!image) return res.status(404).json({ error: "Image not found" });

    // Delete from Cloudinary
    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    // Remove from MongoDB
    await CarouselImage.findByIdAndDelete(req.params.id);

    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Error deleting image:", err);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

module.exports = router;
