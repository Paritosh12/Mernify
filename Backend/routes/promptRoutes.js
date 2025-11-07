import express from "express";
import  {protect} from "../middleware/authMiddleware.js"
import {
    addPrompt,
    getPrompts,
    getPromptById, // Import the controller function
    requestPromptUpdate,
    approvePromptUpdate,
    rejectPromptUpdate
} from "../controllers/promptController.js"

const router=express.Router();

router.route("/")
  .get(getPrompts)
  .post(protect, addPrompt);

// ----------------------------------------------------
// FIX 1: ADD ROUTE FOR FETCHING A SINGLE PROMPT BY ID
router.route("/:id") 
  .get(protect, getPromptById); // IMPORTANT: This route is protected

// ----------------------------------------------------

router.route("/:id/request-update")
  .post(protect, requestPromptUpdate);

router.route("/:promptId/approve/:updateId")
  .put(protect, approvePromptUpdate);

router.route("/:promptId/reject/:updateId")
  .put(protect, rejectPromptUpdate);

export default router;