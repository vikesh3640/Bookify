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

// ✅ CORS configuration for frontend on Vercel
const allowedOrigins = [
    "http://localhost:5173",
    "https://bookify-seven-phi.vercel.app"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true, // Enable sending of cookies
}));

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/books", bookRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);

// ✅ Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
