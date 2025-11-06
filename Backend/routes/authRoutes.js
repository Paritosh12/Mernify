import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // use env variable in production

// --- Register ---
router.post("/register", async (req, res) => {
  try {
    const { name, emailId, password } = req.body;

    if (!name || !emailId || !password)
      return res.status(400).json({ message: "All fields required" });

    const existingUser = await User.findOne({ emailId });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    const user = new User({ name, emailId, password });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, emailId: user.emailId },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user._id, name: user.name, emailId: user.emailId },
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// --- Login ---
router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, emailId: user.emailId },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, emailId: user.emailId },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

export default router;
