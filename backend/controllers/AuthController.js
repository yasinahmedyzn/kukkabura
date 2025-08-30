const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_strong_secret";

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // 👇 Assign role based on email
    const role = email === "mdyasinahmed@gmail.com" ? "admin" : "user";

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        photo: user.photo, // 👈 include profile image
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET PROFILE =================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE PROFILE =================
// 👇 Use upload.single("photo") in route
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    // ✅ If new photo uploaded
    if (req.file) {
      // If old photo exists, delete it first
      if (user.photoId) {
        const cloudinary = require("../config/cloudinary");
        await cloudinary.uploader.destroy(user.photoId);
      }

      user.photo = req.file.path;        // Cloudinary secure_url
      user.photoId = req.file.filename;  // Cloudinary public_id
    }

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /profile/photo
exports.deletePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.photoId) {
      return res.status(400).json({ message: "No profile photo to delete" });
    }

    // Delete from Cloudinary
    const cloudinary = require("../config/cloudinary");
    await cloudinary.uploader.destroy(user.photoId);

    // Remove from MongoDB
    user.photo = undefined;
    user.photoId = undefined;
    await user.save();

    res.json({ message: "Profile photo deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};