const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");


dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'https://kukkabura-git-main-mdyasinahmed-7053s-projects.vercel.app',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));


// Connect to DB
connectDB();

// Routes
const authRoutes = require("./routes/AuthRoutes");
app.use("/api/auth", authRoutes);

// Add carousel routes
const carouselRoutes = require("./routes/carouselImages");
app.use("/api/carousel-images", carouselRoutes);

//top product routes
const topProductsRoutes = require("./routes/topProducts.js");
app.use("/api/top-products", topProductsRoutes);

//new product routes
const newProductsRoutes = require("./routes/newProduct.js");
app.use("/api/new-products", newProductsRoutes);

//Discount Product Routes
const discountProductsRoutes = require("./routes/discountProducts.js");
app.use("/api/discount-products", discountProductsRoutes);

//cart
const cartRoutes = require("./routes/cart");
app.use("/api/cart", cartRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
