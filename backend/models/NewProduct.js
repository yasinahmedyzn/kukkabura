const mongoose = require("mongoose");

const NewProductSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: [String], required: true },
    price: { type: Number, required: true },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true }
      }
    ],
    hoverImageUrl: { type: String, required: true },
    hoverImagePublicId: { type: String, required: true },
    thumbnailIndex: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NewProduct", NewProductSchema);
