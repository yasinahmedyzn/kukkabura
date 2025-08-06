const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");


dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to DB
connectDB();

// Routes
const authRoutes = require("./routes/AuthRoutes");
app.use("/api/auth", authRoutes);

// Add carousel routes
const carouselRoutes = require("./routes/carouselImages");
app.use("/api/carousel-images", carouselRoutes);

// Serve uploads statically
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
