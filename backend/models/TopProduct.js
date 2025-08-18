const mongoose = require("mongoose");

const topProductSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String, required: true },
    hoverImageUrl: { type: String, required: true },
    hoverImagePublicId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TopProduct", topProductSchema);
