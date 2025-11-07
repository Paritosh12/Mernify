// src/pages/PromptDetailPage.jsx
import React, { useState, useEffect } from "react";
import { ThumbsUp, Send, User } from "lucide-react";
import Button from "../components/Common/Button";
import axios from "axios";

const PromptDetailPage = ({ prompt, goBackToLibrary }) => {
  const [upvoteCount, setUpvoteCount] = useState(prompt?.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [postingComment, setPostingComment] = useState(false);

  const token = localStorage.getItem("token");

  // 🧠 Fetch comments from backend
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        const { data } = await axios.get(
          `http://localhost:5000/api/comments/${prompt._id}`
        );
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoadingComments(false);
      }
    };

    if (prompt?._id) fetchComments();
  }, [prompt]);

  // 👍 Handle Upvote
  const handleUpvote = () => {
    setUpvoteCount((prev) => (hasUpvoted ? prev - 1 : prev + 1));
    setHasUpvoted(!hasUpvoted);
    // Optional: send API request to record upvote later
  };

  // 💬 Handle Posting Comment
  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    try {
      setPostingComment(true);
      const { data } = await axios.post(
        "http://localhost:5000/api/comments",
        {
          promptId: prompt._id,
          text: newComment.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Add new comment instantly in UI
      setComments((prev) => [
        { ...data.comment, authorId: { name: "You" } },
        ...prev,
      ]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setPostingComment(false);
    }
  };

  return (
    <div className="prompt-detail-page space-y-6">
      <button
        className="text-sm text-zinc-400 hover:text-white mb-4"
        onClick={goBackToLibrary}
      >
        &larr; Back to library
      </button>

      <h1 className="text-3xl font-bold text-text-primary">{prompt?.title || prompt?.task || "Untitled Prompt"}</h1>
      <p className="text-sm text-zinc-500">
        Creator: {prompt?.createdBy?.name || "Unknown"} | Upvotes: {upvoteCount}
      </p>

      {/* Prompt Content */}
      <h4 className="text-lg font-semibold text-text-primary">Prompt:</h4>
      <pre className="code-block p-4 rounded-xl text-sm overflow-x-auto text-zinc-200">
        <code className="whitespace-pre-wrap">
          {prompt?.body || "No content available."}
        </code>
      </pre>

      {/* Actions */}
      <div className="flex space-x-3">
        <Button
          variant={hasUpvoted ? "success" : "primary"}
          onClick={handleUpvote}
        >
          <ThumbsUp className="w-4 h-4 mr-2" />{" "}
          {hasUpvoted ? `Upvoted (${upvoteCount})` : `Upvote (${upvoteCount})`}
        </Button>

        <button className="px-4 py-2 rounded-lg bg-zinc-700 text-white font-semibold flex items-center hover:bg-zinc-600 transition">
          <Send className="w-4 h-4 mr-2" /> Request Update
        </button>
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <h4 className="text-xl font-semibold mb-4 text-text-primary">
          Comments ({comments.length})
        </h4>

        {loadingComments ? (
          <p className="text-zinc-400">Loading comments...</p>
        ) : comments.length > 0 ? (
          <div className="space-y-3 mb-6">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="bg-surface-secondary p-3 rounded-lg text-sm"
              >
                <div className="flex items-center mb-1">
                  <User className="w-4 h-4 mr-2 text-accent-teal" />
                  <p className="font-semibold text-text-primary">
                    {comment.authorId?.name || "Anonymous"}
                  </p>
                </div>
                <p className="text-zinc-300 ml-6">{comment.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-400">No comments yet.</p>
        )}

        {/* Add Comment */}
        <div className="p-4 bg-surface-secondary rounded-xl">
          <textarea
            placeholder="Add a comment..."
            className="w-full p-2 bg-zinc-800 rounded-lg text-sm border-none focus:ring-1 focus:ring-accent-teal focus:outline-none resize-none h-20"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button
              className="px-4 py-2 text-sm rounded-lg bg-accent-teal text-white hover:bg-teal-600 transition disabled:opacity-60"
              onClick={handlePostComment}
              disabled={postingComment}
            >
              {postingComment ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetailPage;
