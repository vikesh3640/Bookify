const express = require("express");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const fs = require("fs");
const path = require("path");

// Import Routes
const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");
const cartRoutes = require("./routes/cart");
const paymentRoutes = require("./routes/payment");
const orderRoutes = require("./routes/order");

// Initialize environment variables
dotenv.config();

// Create Express App
const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// ✅ Updated CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://bookify-seven-phi.vercel.app/"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,  // Allow credentials (cookies) to be sent
}));

// Middleware
app.use(express.json());
app.use(cookieParser());  // Middleware to parse cookies
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'uploads'
app.use("/uploads", express.static("uploads"));

// Authentication Middleware
const { checkAuth } = require("./middlewares/auth");

// Use Routes
app.use("/api/books", bookRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
