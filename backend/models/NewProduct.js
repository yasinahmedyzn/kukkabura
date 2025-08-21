const mongoose = require("mongoose");

const NewProductSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: [String], required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },          // Cloudinary URL
    imagePublicId: { type: String, required: true },     // Cloudinary public_id
    hoverImageUrl: { type: String, required: true },     // Cloudinary hover URL
    hoverImagePublicId: { type: String, required: true },// Cloudinary hover public_id
  },
  { timestamps: true }
);

module.exports = mongoose.model("NewProduct", NewProductSchema);
