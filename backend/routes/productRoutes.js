const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const Product = require("../models/ProductSchema");

const router = express.Router();

// -----------------
// Multer + Cloudinary Storage
// -----------------
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});
const upload = multer({ storage });

// -----------------
// Helper: normalize array fields
// -----------------
function normalizeField(body, field) {
  const raw = body[`${field}[]`] ?? body[field];
  if (Array.isArray(raw)) return raw.map(s => String(s).trim()).filter(Boolean);
  if (typeof raw === "string") return raw.split(",").map(s => s.trim()).filter(Boolean);
  return [];
}

// -----------------
// Helper: normalize product response
// -----------------
function normalizeProduct(p) {
  return {
    _id: p._id,
    brand: p.brand,
    name: p.name,
    category: p.category,
    productType: p.productType,
    price: p.price,
    discountPercentage: p.discountPercentage || 0,
    discountPrice: p.price - (p.price * (p.discountPercentage || 0)) / 100,
    images: p.images || [],
    thumbnailIndex: p.thumbnailIndex || 0,
    hoverImageUrl: p.images?.[1]?.url || null,

    // ✅ New fields
    description: p.description || "",
    featuresDetails: p.featuresDetails || "",
    ingredients: p.ingredients || "",
    activeIngredients: p.activeIngredients || "",
    directions: p.directions || "",
    benefits: p.benefits || "",
    recommendedUses: p.recommendedUses || "",

    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

// =========================================================
// CREATE PRODUCT
// =========================================================
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const {
      brand,
      name,
      price,
      thumbnailIndex,
      discountPercentage,
      description,
      featuresDetails,
      ingredients,
      activeIngredients,
      directions,
      benefits,
      recommendedUses,
    } = req.body;

    const category = normalizeField(req.body, "category");
    const productType = normalizeField(req.body, "productType");

    if (!category.length) {
      return res.status(400).json({ message: "Category is required" });
    }
    if (!req.files || !req.files.length) {
      return res.status(400).json({ message: "At least one product image is required" });
    }

    const images = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
    }));

    const product = new Product({
      brand,
      name,
      price,
      category,
      productType: productType.length ? productType : ["regular"],
      images,
      thumbnailIndex: Number(thumbnailIndex) || 0,
      discountPercentage: discountPercentage || 0,

      // ✅ New fields
      description,
      featuresDetails,
      ingredients,
      activeIngredients,
      directions,
      benefits,
      recommendedUses,
    });

    await product.save();
    res.status(201).json(normalizeProduct(product));
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// =========================================================
// GET ALL PRODUCTS (with filters, pagination, sorting)
// =========================================================
router.get("/", async (req, res) => {
  try {
    const {
      category,
      brand,
      productType,
      minPrice = 0,
      maxPrice = Infinity,
      sort = "latest",
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {
      price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
    };
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (productType) filter.productType = productType;

    let query = Product.find(filter);

    // ✅ Sorting
    if (sort === "priceLowHigh") query = query.sort({ price: 1 });
    else if (sort === "priceHighLow") query = query.sort({ price: -1 });
    else if (sort === "brandAZ") query = query.sort({ brand: 1 });
    else if (sort === "brandZA") query = query.sort({ brand: -1 });
    else query = query.sort({ createdAt: -1 }); // latest

    // ✅ Pagination
    const skip = (page - 1) * limit;
    const products = await query.skip(skip).limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      products: products.map(normalizeProduct),
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: err.message });
  }
});

// =========================================================
// GET SINGLE PRODUCT
// =========================================================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(normalizeProduct(product));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================================================
// UPDATE PRODUCT
// =========================================================
router.put("/:id", upload.array("images", 10), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const {
      brand,
      name,
      price,
      thumbnailIndex,
      discountPercentage,
      deleteImagePublicId,
      description,
      featuresDetails,
      ingredients,
      activeIngredients,
      directions,
      benefits,
      recommendedUses,
    } = req.body;

    if (brand !== undefined) product.brand = brand;
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (discountPercentage !== undefined) product.discountPercentage = discountPercentage;

    const nextCategory = normalizeField(req.body, "category");
    if (nextCategory.length) product.category = nextCategory;

    const nextType = normalizeField(req.body, "productType");
    if (nextType.length) product.productType = nextType;

    // ✅ Update new fields
    if (description !== undefined) product.description = description;
    if (featuresDetails !== undefined) product.featuresDetails = featuresDetails;
    if (ingredients !== undefined) product.ingredients = ingredients;
    if (activeIngredients !== undefined) product.activeIngredients = activeIngredients;
    if (directions !== undefined) product.directions = directions;
    if (benefits !== undefined) product.benefits = benefits;
    if (recommendedUses !== undefined) product.recommendedUses = recommendedUses;

    // ✅ Replace images
    if (req.files && req.files.length) {
      for (const img of product.images) {
        await cloudinary.uploader.destroy(img.publicId);
      }
      product.images = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
      }));
    }

    // ✅ Update thumbnail index
    if (thumbnailIndex !== undefined) {
      product.thumbnailIndex = Number(thumbnailIndex);
    }

    // ✅ Delete image if requested
    if (deleteImagePublicId) {
      const idx = product.images.findIndex(img => img.publicId === deleteImagePublicId);
      if (idx !== -1) {
        await cloudinary.uploader.destroy(deleteImagePublicId);
        product.images.splice(idx, 1);
        if (product.thumbnailIndex === idx) product.thumbnailIndex = 0;
        else if (product.thumbnailIndex > idx) product.thumbnailIndex -= 1;
      }
    }

    await product.save();
    res.json(normalizeProduct(product));
  } catch (err) {
    console.error("Failed to update product:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// =========================================================
// DELETE PRODUCT
// =========================================================
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.images && product.images.length) {
      for (const img of product.images) {
        await cloudinary.uploader.destroy(img.publicId);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted product and images successfully" });
  } catch (err) {
    console.error("Failed to delete product:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// =========================================================
// EXTRA ENDPOINTS: Categories & Brands
// =========================================================
router.get("/all/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err });
  }
});

router.get("/all/brands", async (req, res) => {
  try {
    const brands = await Product.distinct("brand");
    res.json({ brands });
  } catch (err) {
    res.status(500).json({ message: "Error fetching brands", error: err });
  }
});

// =========================================================
// SEARCH PRODUCTS (by name, description, category, brand)
// =========================================================
router.get("/search/query", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q || !q.trim()) return res.json([]);

    const regex = new RegExp(q, "i"); // case-insensitive

    const products = await Product.find({
      $or: [
        { name: regex },
        { brand: regex },
        { description: regex },
        { category: { $in: [regex] } } // matches array elements
      ],
    }).limit(20);

    res.json(products); // return full products for now
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

module.exports = router;
