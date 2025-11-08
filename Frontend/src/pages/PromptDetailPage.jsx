// src/pages/PromptDetailPage.jsx
import React, { useState, useEffect } from "react";
import { ThumbsUp, Send, User } from "lucide-react";
import Button from "../components/Common/Button";
import api from "../api/axiosConfig"; // use shared axios config

import { jwtDecode } from "jwt-decode";

const getCurrentUserId = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const decoded = jwtDecode(token);
    return decoded.id;
  } catch (err) {
    console.error("Failed to decode token", err);
    return null;
  }
};

const PromptDetailPage = ({ prompt, goBackToLibrary }) => {
  // Local prompt state so we can re-fetch/upsert easily
  const [promptData, setPromptData] = useState(prompt || null);

  const [upvoteCount, setUpvoteCount] = useState(prompt?.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [postingComment, setPostingComment] = useState(false);

  // Fetch the latest prompt details whenever prompt._id changes
  useEffect(() => {
    const fetchPromptDetail = async () => {
      if (!prompt?._id) return;
      try {
        const { data } = await api.get(`/prompts/${prompt._id}`);
        setPromptData(data);
        setUpvoteCount(data?.upvotes || 0);
      
        // Determine whether current user has upvoted
        const currentUserId = getCurrentUserId();
      
        // Case 1: backend returned upvotedBy array (preferred)
        if (Array.isArray(data?.upvotedBy)) {
          const has = data.upvotedBy.some(u => {
            // elements might be ObjectId strings or populated objects
            return (u === currentUserId) || (u?._id === currentUserId);
          });
          setHasUpvoted(Boolean(has));
          return;
        }
      
        // Case 2: fallback - call an endpoint that returns list of upvoted prompt IDs for this user
        // (optional: implement GET /api/prompts/upvoted/me on backend)
        if (currentUserId) {
          try {
            const upvResp = await api.get("/prompts/upvoted/me");
            const upvotedIds = upvResp.data.items || [];
            setHasUpvoted(upvotedIds.includes(data._id));
          } catch (err) {
            // fallback: assume not upvoted if we can't determine
            setHasUpvoted(false);
          }
        } else {
          setHasUpvoted(false);
        }
      } catch (err) {
        console.error("Error fetching prompt details:", err);
        setPromptData(prompt);
      }
    };


    fetchPromptDetail();
  }, [prompt]);

  // Fetch comments from backend when promptData becomes available or its id changes
  useEffect(() => {
    const fetchComments = async () => {
      if (!promptData?._id) {
        setComments([]);
        setLoadingComments(false);
        return;
      }

      try {
        setLoadingComments(true);
        const { data } = await api.get(`/comments/${promptData._id}`);
        setComments(data || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [promptData]);

  // Handle Upvote (UI-only here; you can call API to persist)
  const handleUpvote = async () => {
    if (!promptData?._id) return;

    // optimistic
    setUpvoteCount((prev) => (hasUpvoted ? prev - 1 : prev + 1));
    setHasUpvoted((prev) => !prev);

    try {
      // toggle endpoint (use PUT; change to POST if your server uses POST)
      const { data } = await api.put(`/prompts/${promptData._id}/upvote`);

      // update state from server
      setUpvoteCount(data.upvotes);
      setHasUpvoted(Boolean(data.hasUpvoted));

      // update promptData (so body of page and other fields reflect server)
      setPromptData((prev) => ({ ...prev, upvotes: data.upvotes }));
    } catch (err) {
      console.error("Failed to persist upvote:", err.response?.data || err.message);
      // revert optimistic
      setUpvoteCount((prev) => (hasUpvoted ? prev + 1 : prev - 1));
      setHasUpvoted((prev) => !prev);
      // optional: show toast
      alert(err.response?.data?.message || "Failed to upvote.");
    }
  };

  // Post a comment
  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    if (!promptData?._id) return;

    try {
      setPostingComment(true);
      const { data } = await api.post(
        "/comments",
        {
          promptId: promptData._id,
          text: newComment.trim(),
        }
      );

      // Add new comment instantly in UI; backend should return the created comment
      setComments((prev) => [
        { ...data.comment, authorId: { name: "You" } },
        ...prev,
      ]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
      // optional: show user-visible error
      alert(error.response?.data?.message || "Failed to post comment.");
    } finally {
      setPostingComment(false);
    }
  };

  // "Request Update" click: open a modal or route to a widget for creating requests.
  // For now we'll show a simple prompt (quick implementation). Replace with a modal as needed.
  const handleRequestUpdate = async () => {
    if (!promptData?._id) return;
    const proposed = window.prompt("Paste the proposed prompt text (or description):");
    if (!proposed) return;
  
    try {
      // POST to the endpoint your backend uses
      const { data } = await api.post(`/prompts/${promptData._id}/request-update`, {
        body: proposed,   // backend expects `body`
      });
    
      // success feedback
      alert(data.message || "Request submitted — awaiting review.");
    
      // Optionally add the pending update to UI (if backend returns it)
      // For example, if backend returned pendingUpdate:
      // setPendingRequests(prev => [data.pendingUpdate, ...prev]);
    } catch (err) {
      console.error("Submit request error:", err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to submit request."
      );
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

      <h1 className="text-3xl font-bold text-text-primary">
        {promptData?.title || promptData?.task || "Untitled Prompt"}
      </h1>
      <p className="text-sm text-zinc-500">
        Creator: {promptData?.createdBy?.name || "Unknown"} | Upvotes: {upvoteCount}
      </p>

      {/* Prompt Content */}
      <h4 className="text-lg font-semibold text-text-primary">Prompt:</h4>
      <pre className="code-block p-4 rounded-xl text-sm overflow-x-auto text-zinc-200">
        <code className="whitespace-pre-wrap">
          {promptData?.body || "No content available."}
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

        <button
          className="px-4 py-2 rounded-lg bg-zinc-700 text-white font-semibold flex items-center hover:bg-zinc-600 transition"
          onClick={handleRequestUpdate}
        >
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
