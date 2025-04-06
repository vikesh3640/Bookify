const { Router } = require("express");
const User = require("../models/user");
const { checkAuth } = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");

const router = Router();

// Set up Multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files to backend/uploads/
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); 
    }
});

const upload = multer({ storage });

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const user = await User.create({ fullName, email, password });
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login Route
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await User.matchPasswordAndGenerateToken(email, password);
        const user = await User.findOne({ email }).select("fullName email profileImageURL");

        res.cookie("token", token, {
            httpOnly: true,
            secure: true, // Only sent over HTTPS
            sameSite: "None" // Allows cookies to be sent cross-origin
        }).json({
            success: true,
            token,
            user
        });
        
    } catch (error) {
        res.status(401).json({ error: "Invalid email or password" });
    }
});

// Logout Route
router.get("/logout", (req, res) => {
    res.clearCookie("token").json({ message: "Logged out successfully" });
});

// Get User Details
router.get('/me', checkAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("fullName email profileImageURL mobileNo gender address");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch {
        res.status(500).json({ error: "Server error" });
    }
});

// Update User Profile with Image Upload
router.put('/update-profile', checkAuth, upload.single('profileImage'), async (req, res) => {
    try {
        console.log("User ID from token:", req.user._id);
        console.log("Received Data:", req.body);
        console.log("Received File:", req.file);

        const { mobileNo, gender, address } = req.body;
        const profileImageURL = req.file ? `/uploads/${req.file.filename}` : req.body.profileImageURL;

        const updatedUser = await User.findByIdAndUpdate(req.user._id, {
            profileImageURL,
            mobileNo,
            gender,
            address
        }, { new: true });

        console.log("Updated User in DB:", updatedUser);
        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
