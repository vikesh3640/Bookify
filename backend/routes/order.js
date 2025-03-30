const express = require("express");
const router = express.Router();
const Order = require("../models/order");  // Ensure this path is correct

router.get("/", async (req, res) => {
  try {
    console.log("Received request at /api/orders");

    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    const orders = await Order.find({ userId }).populate("items.bookId");
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

module.exports = router;  // <-- Ensure the router is exported
