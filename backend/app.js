const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const connectDB = require("./config/db");


dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*', // allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(bodyParser.json());


// Connect to DB
connectDB();

// Custom middleware to skip body parsing for GET requests on /api/products
app.use('/api/products', (req, res, next) => {
  if (req.method === 'GET') {
    return next(); // Skip body parsing for GET requests
  }
  next();
});

// Routes
const authRoutes = require("./routes/AuthRoutes");
app.use("/api/auth", authRoutes);

// Add carousel routes
const carouselRoutes = require("./routes/carouselImages");
app.use("/api/carousel-images", carouselRoutes);

//cart
const cartRoutes = require("./routes/cart");
app.use("/api/cart", cartRoutes);

//product fetch
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

//payment route
const paymentRoute = require('./routes/payment');
app.use('/api/payment', paymentRoute);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
