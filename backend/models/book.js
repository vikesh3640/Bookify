const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  bookName: { type: String, required: true },
  bookDetails: { type: String, required: true },
  demandPrice: { type: Number, required: true },
  bookCondition: { type: String, enum: ["Excellent", "Fair", "Poor"], required: true },
  state: { type: String, required: true },
  addressLine: { type: String, required: true },
  contactNumber: { type: String, required: true },
  photos: { type: [String], default: [] },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // rating: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Book", bookSchema);


