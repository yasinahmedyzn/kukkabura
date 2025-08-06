// models/CarouselImage.js
const mongoose = require("mongoose");

const CarouselImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("CarouselImage", CarouselImageSchema);
