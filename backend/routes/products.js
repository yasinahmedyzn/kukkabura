const express = require("express");
const router = express.Router();

const TopProduct = require("../models/TopProduct");
const DiscountProduct = require("../models/DiscountProducts");
const NewProduct = require("../models/NewProduct");
const AddProduct = require("../models/AddProduct");
// ✅ Get all categories
router.get("/all/categories", async (req, res) => {
  try {
    const top = await TopProduct.distinct("category");
    const discount = await DiscountProduct.distinct("category");
    const newP = await NewProduct.distinct("category");
    const addP = await AddProduct.distinct("category");

    const categories = [...new Set([...top, ...discount, ...newP, ...addP])];
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
});

// ✅ Get all brands
router.get("/all/brands", async (req, res) => {
  try {
    const top = await TopProduct.distinct("brand");
    const discount = await DiscountProduct.distinct("brand");
    const newP = await NewProduct.distinct("brand");
    const addP = await AddProduct.distinct("category");

    const brands = [...new Set([...top, ...discount, ...newP, ...addP])];
    res.json({ brands });
  } catch (error) {
    res.status(500).json({ message: "Error fetching brands", error });
  }
});

// ✅ Get products by filters (category, brand, price, sort, pagination)
router.get("/all/products", async (req, res) => {
  try {
    const {
      category,
      brand,
      sort = "latest",
      minPrice = 0,
      maxPrice = Infinity,
      page = 1,
      limit = 12
    } = req.query;

    // Build filter
    const filter = { price: { $gte: minPrice, $lte: maxPrice } };
    if (category) filter.category = category;
    if (brand) filter.brand = brand;

    // Fetch products from all models
    const top = (await TopProduct.find(filter)).map(p => ({ ...p._doc, type: "Top Product" }));
    const discount = (await DiscountProduct.find(filter)).map(p => ({ ...p._doc, type: "Discount Product" }));
    const newP = (await NewProduct.find(filter)).map(p => ({ ...p._doc, type: "New Product" }));
    const addP = (await AddProduct.find(filter)).map(p => ({ ...p._doc, type: "Add Product" }));

    let products = [...top, ...discount, ...newP, ...addP];

    // ✅ Sorting
    if (sort === "priceLowHigh") {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === "priceHighLow") {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === "latest") {
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "brandAZ") {
      products.sort((a, b) => a.brand.localeCompare(b.brand));
    } else if (sort === "brandZA") {
      products.sort((a, b) => b.brand.localeCompare(a.brand));
    }

    // ✅ Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = products.slice(startIndex, endIndex);

    res.json({
      total: products.length,
      page: parseInt(page),
      limit: parseInt(limit),
      products: paginatedProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// ✅ Get single product by ID from any schema
router.get("/details/:id", async (req, res) => {
  const { id } = req.params;

  try {
    let product =
      (await TopProduct.findById(id)) ||
      (await DiscountProduct.findById(id)) ||
      (await NewProduct.findById(id)) ||
      (await AddProduct.findById(id));

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Normalize response (so frontend doesn’t need to check schema type)
    const normalized = {
      _id: product._id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      discountPrice: product.discprice || product.price,
      images: product.images || [], 
      thumbnailIndex: product.thumbnailIndex || 0, 
      hoverImageUrl: product.hoverImageUrl,
      type: product.type || "General",
      createdAt: product.createdAt,
      description: product.description,
      features: product.features,
      benefits: product.benefits,
    
    };

    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product details", error });
  }
});

module.exports = router;
