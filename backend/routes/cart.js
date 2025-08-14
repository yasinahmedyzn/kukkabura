// routes/cart.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const Cart = require("../models/Cart");
const TopProduct = require("../models/TopProduct");
const NewProduct = require("../models/NewProduct");

// 📌 Get current user's cart
router.get("/", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
    res.json(cart || { userId: req.user.id, items: [] });
  } catch (err) {
    console.error("GET /cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 Add product to cart (TopProduct or NewProduct)
router.post("/", verifyToken, async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  try {
    // Check TopProduct first
    let product = await TopProduct.findById(productId);

    // If not found, check NewProduct
    if (!product) {
      product = await NewProduct.findById(productId);
    }

    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) cart = new Cart({ userId: req.user.id, items: [] });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity; // Increase quantity
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    const updatedCart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
    res.json(updatedCart);
  } catch (err) {
    console.error("POST /cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 Update quantity of a product
router.put("/:productId", verifyToken, async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) return res.status(404).json({ message: "Product not in cart" });

    if (quantity <= 0) {
      // Remove item if quantity <= 0
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    const updatedCart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
    res.json(updatedCart);
  } catch (err) {
    console.error("PUT /cart/:productId error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 Remove a single item from cart
router.delete("/:productId", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== req.params.productId
    );

    await cart.save();
    const updatedCart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
    res.json(updatedCart);
  } catch (err) {
    console.error("DELETE /cart/:productId error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 Clear entire cart
router.delete("/", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({ userId: req.user.id });
    res.json({ message: "Cart cleared", items: [] });
  } catch (err) {
    console.error("DELETE /cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
