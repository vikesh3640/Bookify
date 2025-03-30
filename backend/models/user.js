const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require('mongoose');
const { createTokenForUser } = require("../services/authentication");

const userSchema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    salt: { type: String },
    password: { type: String, required: true },
    profileImageURL: { type: String, default: "/images/default.webp" },
    mobileNo: { type: String, default: "" }, 
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "Other" },
    address: { type: String, default: "" }, 
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" }
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", function (next) {
    if (!this.isModified("password")) return next();
    this.salt = randomBytes(16).toString("hex");
    this.password = createHmac('sha256', this.salt).update(this.password).digest("hex");
    next();
});

// Password Matching & Token Generation
userSchema.statics.matchPasswordAndGenerateToken = async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('User not found');

    const hash = createHmac('sha256', user.salt).update(password).digest("hex");
    if (hash !== user.password) throw new Error('Incorrect password');

    return createTokenForUser(user);
};

const User = model('User', userSchema);
module.exports = User;
