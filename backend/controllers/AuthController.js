const bcrypt = require("bcryptjs");
const User = require("../models/User");

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
      role, // 👈 include the role here
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// 👇 Add this login function
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    // 👇 Send role back
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role, // 👈 send role
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};