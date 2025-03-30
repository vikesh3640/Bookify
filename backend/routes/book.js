const express = require("express");
const multer = require("multer");
const path = require("path");
const Book = require("../models/book");
const { checkAuth } = require("../middlewares/auth");

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// POST - Upload a new book
router.post("/upload", checkAuth, upload.array("photos", 6), async (req, res) => {
  try {
    const { bookName, bookDetails, demandPrice, bookCondition, state, addressLine, contactNumber } = req.body;
    const newBook = new Book({
      bookName,
      bookDetails,
      demandPrice,
      bookCondition,
      state,
      addressLine,
      contactNumber,
      photos: req.files.map((file) => file.filename),
      seller: req.user._id
    });
    await newBook.save();
    res.status(201).json({ message: "Book uploaded successfully!", book: newBook });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload book details" });
  }
});

//  GET - Fetch all books
router.get("/all", async (req, res) => {
  try {
    const books = await Book.find().populate("seller", "fullName email");
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
});

//  GET - Fetch a single book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("seller", "fullName email");

    if (!book) {
      return res.status(404).json({ message: `Book with ID ${req.params.id} not found` });
    }

    // Exclude state, addressLine, and contactNumber from the response
    const { state, addressLine, contactNumber, ...filteredBook } = book.toObject();

    res.status(200).json(filteredBook);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book details", error });
  }
});

module.exports = router;
