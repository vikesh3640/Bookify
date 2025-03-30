const express = require("express");
const { createOrder, verifyPayment, getPaymentDetails } = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/payment-details/:paymentId", getPaymentDetails);

module.exports = router;
