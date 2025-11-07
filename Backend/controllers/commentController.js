// controllers/commentController.js
import Comment from '../models/Comment.js';
import Prompt from '../models/Prompt.js';
import mongoose from 'mongoose';
// ✅ Add a comment to a prompt
export const addComment = async (req, res) => {
  try {
    const { promptId, text } = req.body;

    if (!promptId || !text.trim()) {
      return res.status(400).json({ message: "Prompt ID and text are required" });
    }

    const newComment = await Comment.create({
      promptId,
      authorId: req.user._id,  // ✅ use req.user._id set by authMiddleware
      text,
    });

    res.status(201).json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};

// ✅ Get all comments for a given prompt
export const getComments = async (req, res) => {
  try {
    const { promptId } = req.params;

    const comments = await Comment.find({ promptId })
      .populate("authorId", "name") // Include author name
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments", error: error.message });
  }
};
