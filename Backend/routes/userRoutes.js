import express from 'express';
import { registerUser,authUser,getUserDetails } from "../controllers/userController.js";
import { protect } from '../middleware/authMiddleware.js';
const router=express.Router();

// Register User
router.post("/register", registerUser);

// Authenticate User
router.post("/login", authUser);

router.get("/me", protect, getUserDetails);

export default router;