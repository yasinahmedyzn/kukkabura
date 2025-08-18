const mongoose = require("mongoose");

const CarouselImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },        // Cloudinary URL
    publicId: { type: String, required: true },   // Cloudinary public_id
  },
  { timestamps: true }
);

module.exports = mongoose.model("CarouselImage", CarouselImageSchema);
