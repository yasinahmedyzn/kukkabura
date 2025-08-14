const mongoose = require("mongoose");

const topProductSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true }, // Default image
  hoverImageUrl: { type: String, required: true }, // Hover image
}, { timestamps: true });

module.exports = mongoose.model("TopProduct", topProductSchema);
