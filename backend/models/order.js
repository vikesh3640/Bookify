const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Completed"], required: true }, 
    items: [
      {
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
        quantity: { type: Number, required: true },
      },
    ],
});

module.exports = mongoose.model("Order", orderSchema);
