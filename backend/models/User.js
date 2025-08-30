const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  phone:     { type: String },
  address:   { type: String },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  photo: { type: String },       // 👈 Cloudinary image URL
  photoId: { type: String },     // 👈 Cloudinary public_id
});

module.exports = mongoose.model("User", userSchema);
