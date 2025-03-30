const Razorpay = require("razorpay");
const crypto = require("crypto");
const dotenv = require("dotenv");
const Order = require("../models/order");

dotenv.config();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
const createOrder = async (req, res) => {
  const { amount, userId, items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: "Items cannot be empty" });
  }

  try {
    const options = {
      amount: amount * 100, // Convert to paisa
      currency: "INR",
      receipt: `order_rcpt_${userId}`,
    };

    const order = await razorpay.orders.create(options);

    // Save order in DB
    const newOrder = new Order({
      userId,
      orderId: order.id,
      amount,
      items,
      paymentStatus: "Pending",
    });

    await newOrder.save();

    res.json({ success: true, orderId: order.id, amount });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Verify Payment (Fixed with HMAC Signature Validation)
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment details" });
    }

    // Fetch order from DB
    const order = await Order.findOne({ orderId: razorpay_order_id });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Signature Verification (Ensuring Security)
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // Update order status
    order.paymentId = razorpay_payment_id;
    order.paymentStatus = "Completed";
    await order.save();

    res.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get Payment Details ( Search by orderId)
const getPaymentDetails = async (req, res) => {
  const { orderId } = req.params; 

  try {
    const order = await Order.findOne({ orderId }).populate("items.bookId");

    if (!order) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    res.json({
      success: true,
      amount: order.amount,
      currency: "INR",
      status: order.paymentStatus,
      items: order.items,
      method: "Online Payment",
    });
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { createOrder, verifyPayment, getPaymentDetails };
