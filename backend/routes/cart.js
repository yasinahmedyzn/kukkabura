// routes/cart.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const Cart = require("../models/Cart");
const TopProduct = require("../models/TopProduct");
const NewProduct = require("../models/NewProduct");
const DiscountProduct = require("../models/DiscountProducts");
const AddProduct = require("../models/AddProduct"); // ✅ Include AddProduct

// Helper: populate product from multiple collections
const populateProduct = async (productId) => {
  let product =
    (await TopProduct.findById(productId)) ||
    (await NewProduct.findById(productId)) ||
    (await DiscountProduct.findById(productId)) ||
    (await AddProduct.findById(productId));
  return product;
};

// -------------------- GET CART --------------------
router.get("/", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.json({ userId: req.user.id, items: [] });

    const itemsWithProduct = await Promise.all(
      cart.items.map(async (item) => {
        const product = await populateProduct(item.productId);
        return { ...item._doc, productId: product };
      })
    );

    res.json({ ...cart._doc, items: itemsWithProduct });
  } catch (err) {
    console.error("GET /cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- ADD TO CART --------------------
router.post("/", verifyToken, async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  try {
    const product = await populateProduct(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) cart = new Cart({ userId: req.user.id, items: [] });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    const updatedCart = await Cart.findOne({ userId: req.user.id });
    const itemsWithProduct = await Promise.all(
      updatedCart.items.map(async (item) => {
        const product = await populateProduct(item.productId);
        return { ...item._doc, productId: product };
      })
    );

    res.json({ ...updatedCart._doc, items: itemsWithProduct });
  } catch (err) {
    console.error("POST /cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- UPDATE QUANTITY --------------------
router.put("/:productId", verifyToken, async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex === -1) return res.status(404).json({ message: "Product not in cart" });

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    const updatedCart = await Cart.findOne({ userId: req.user.id });
    const itemsWithProduct = await Promise.all(
      updatedCart.items.map(async (item) => {
        const product = await populateProduct(item.productId);
        return { ...item._doc, productId: product };
      })
    );

    res.json({ ...updatedCart._doc, items: itemsWithProduct });
  } catch (err) {
    console.error("PUT /cart/:productId error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- REMOVE SINGLE ITEM --------------------
router.delete("/:productId", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== req.params.productId
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ userId: req.user.id });
    const itemsWithProduct = await Promise.all(
      updatedCart.items.map(async (item) => {
        const product = await populateProduct(item.productId);
        return { ...item._doc, productId: product };
      })
    );

    res.json({ ...updatedCart._doc, items: itemsWithProduct });
  } catch (err) {
    console.error("DELETE /cart/:productId error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- CLEAR CART --------------------
router.delete("/", verifyToken, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.id });
    res.json({ message: "Cart cleared", items: [] });
  } catch (err) {
    console.error("DELETE /cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
