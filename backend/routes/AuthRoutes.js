const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/AuthController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser); // 👈 Add this line

router.get("/profile", verifyToken, (req, res) => {
  res.json({ message: "Welcome!", user: req.user });
});

module.exports = router;
