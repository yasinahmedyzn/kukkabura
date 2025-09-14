const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    name: { type: String, required: true },

    // Business category (makeup, skincare, face, eye, lips, etc.)
    category: { type: [String], required: true },

    price: { type: Number, required: true },

    // Multiple images (first = main, second = hover, others = gallery)
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],

    // Which image is the thumbnail (default = 0 → first image)
    thumbnailIndex: { type: Number, default: 0 },

    // New field for homepage section type
    productType: {
      type: [String],
      enum: ["regular", "new", "discount", "top"],
      default: ["regular"],
    },

    // If discount product
    discountPercentage: { type: Number, default: 0 },

    description: { type: String, default: "" },
    featuresDetails: { type: String, default: "" },
    ingredients: { type: String, default: "" },
    activeIngredients: { type: String, default: "" },
    directions: { type: String, default: "" },
    benefits: { type: String, default: "" },
    recommendedUses: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
