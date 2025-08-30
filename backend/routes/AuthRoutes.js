const express = require("express");
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getProfile, 
  updateProfile,
deletePhoto
} = require("../controllers/AuthController");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // 👈 Cloudinary multer config

// Register & Login
router.post("/register", registerUser);
router.post("/login", loginUser);


router.delete("/profile/photo", verifyToken, deletePhoto);

// Profile
router.get("/profile", verifyToken, getProfile);

// 👇 Add upload.single("photo") for image upload
router.put(
  "/profile",
  verifyToken,
  upload.single("photo"),   // ⬅️ Multer handles image upload to Cloudinary
  updateProfile
);

module.exports = router;
