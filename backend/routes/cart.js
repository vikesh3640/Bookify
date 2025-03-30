const express = require("express");
const Cart = require("../models/cart");
const Book = require("../models/book");
const { checkAuth } = require("../middlewares/auth");

const router = express.Router();

// Add book to cart
router.post("/add", checkAuth, async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId }) || new Cart({ user: userId, items: [] });

    const existingItem = cart.items.find(item => item.book.toString() === bookId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const book = await Book.findById(bookId);
      if (!book) return res.status(404).json({ error: "Book not found" });

      cart.items.push({ book: bookId, quantity: 1 });
    }

    await cart.save();
    res.json({ message: "Book added to cart", cart });
  } catch {
    res.status(500).json({ error: "Error adding book to cart" });
  }
});

// Get user's cart
router.get("/", checkAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.book");
    res.json(cart || { user: req.user._id, items: [] });
  } catch {
    res.status(500).json({ error: "Error fetching cart" });
  }
});

// Remove book from cart
router.delete("/remove/:bookId", checkAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(item => item.book.toString() !== req.params.bookId);
    await cart.save();

    res.json({ message: "Book removed from cart", cart });
  } catch {
    res.status(500).json({ error: "Error removing book from cart" });
  }
});

// Update book quantity in cart
router.put("/update", checkAuth, async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ error: "Quantity must be at least 1" });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(item => item.book.toString() === bookId);
    if (!item) return res.status(404).json({ error: "Book not found in cart" });

    item.quantity = quantity;
    await cart.save();
    res.json({ message: "Quantity updated successfully", cart });
  } catch {
    res.status(500).json({ error: "Error updating quantity" });
  }
});

module.exports = router;
