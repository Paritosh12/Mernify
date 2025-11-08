// routes/promptRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addPrompt,
  getPrompts,
  getPromptById,
  requestPromptUpdate,
  approvePromptUpdate,
  rejectPromptUpdate,
  getPendingUpdates,
  togglePromptUpvote,
  getUserUpvotedPrompts
} from "../controllers/promptController.js";

const router = express.Router();

router.route("/")
  .get(getPrompts)
  .post(protect, addPrompt);

// endpoints for upvotes & user upvoted list (protected)
router.get("/upvoted/me", protect, getUserUpvotedPrompts);
router.put("/:id/upvote", protect, togglePromptUpvote);

// pending updates list (owner-only view)
router.get("/pending", protect, getPendingUpdates);

// Single prompt
router.route("/:id")
  .get(protect, getPromptById);

// Request update: create a new pending update (protected)
router.route("/:id/request-update")
  .post(protect, requestPromptUpdate);

// Approve / Reject update (protected)
router.route("/:promptId/approve/:updateId")
  .put(protect, approvePromptUpdate);

router.route("/:promptId/reject/:updateId")
  .put(protect, rejectPromptUpdate);

export default router;
