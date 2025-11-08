// src/pages/LibraryView.jsx
import React, { useEffect, useState } from "react";
import PromptCard from "../components/Common/PromptCard";
import { Plus } from "lucide-react";
import Button from "../components/Common/Button";
import AddPromptModal from "../components/Modals/AddpromptModal";
import api from "../api/axiosConfig";

const LibraryView = ({ onPromptSelect, selectedWorkspaceId }) => {
  const [prompts, setPrompts] = useState([]);
  const [workspaceName, setWorkspaceName] = useState("Loading...");
  const [isAddPromptModalOpen, setIsAddPromptModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // keep set of prompt IDs the current user has upvoted
  const [userUpvotedSet, setUserUpvotedSet] = useState(new Set());
  const [upvotingIds, setUpvotingIds] = useState(new Set()); // to disable while request in-flight

  useEffect(() => {
    const fetchWorkspacePrompts = async () => {
      if (!selectedWorkspaceId) {
        setPrompts([]);
        setWorkspaceName("Select a workspace");
        return;
      }

      setLoading(true);
      try {
        // Get all workspaces (as before)
        const { data } = await api.get("/workspaces");
        const workspace = data.find((w) => w._id === selectedWorkspaceId);
        if (workspace) {
          // ensure prompt objects include upvotes/upvotesBy (backend should send upvotes/upvotedBy)
          setPrompts(workspace.prompts || []);
          setWorkspaceName(workspace.title);
        } else {
          setWorkspaceName("Unknown Workspace");
          setPrompts([]);
        }

        // Also fetch which prompts the current user has upvoted (if logged in)
        try {
          const upvResp = await api.get("/prompts/upvoted/me");
          const ids = new Set((upvResp.data.items || []).map((id) => id.toString()));
          setUserUpvotedSet(ids);
        } catch (err) {
          // if not authenticated or endpoint missing, silently ignore
          console.warn("Could not fetch upvoted prompts for user:", err.response?.data || err.message);
        }
      } catch (error) {
        console.error("Error fetching workspace prompts:", error);
        setWorkspaceName("Error loading workspace");
        setPrompts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspacePrompts();
  }, [selectedWorkspaceId]);

  // Optimistic toggle handler
  const handleUpvote = async (promptId) => {
    if (upvotingIds.has(promptId)) return;
    setUpvotingIds(prev => new Set([...prev, promptId]));

    // local optimistic update
    setPrompts(prev =>
      prev.map(p => {
        if (p._id !== promptId) return p;
        const currentlyUpvoted = userUpvotedSet.has(promptId);
        return {
          ...p,
          upvotes: (p.upvotes || 0) + (currentlyUpvoted ? -1 : 1),
        };
      })
    );

    try {
      // toggle on server - adjust method if backend uses POST
      const { data } = await api.put(`/prompts/${promptId}/upvote`);

      // update prompt upvotes according to server authoritative value
      setPrompts(prev => prev.map(p => (p._id === promptId ? { ...p, upvotes: data.upvotes } : p)));

      // update userUpvotedSet from server response
      setUserUpvotedSet(prev => {
        const s = new Set(prev);
        if (data.hasUpvoted) s.add(promptId);
        else s.delete(promptId);
        return s;
      });
    } catch (err) {
      console.error("Failed to upvote:", err.response?.data || err.message);
      // revert optimistic change by re-fetching the single prompt (safe fallback)
      try {
        const { data: refreshed } = await api.get(`/prompts/${promptId}`);
        setPrompts(prev => prev.map(p => (p._id === promptId ? refreshed : p)));
      } catch (reErr) {
        console.error("Failed to refresh prompt after upvote error", reErr);
      }
    } finally {
      setUpvotingIds(prev => {
        const s = new Set(prev);
        s.delete(promptId);
        return s;
      });
    }
  };

  const handlePromptAdded = (newPrompt) => {
    setPrompts((prev) => [...prev, newPrompt]);
  };

  if (loading) return <p className="text-zinc-400 p-4">Loading workspace...</p>;

  return (
    <div className="flex h-full -mt-8">
      <div className="w-full pr-6 flex flex-col">
        <h2 className="text-3xl font-semibold text-text-primary mb-4">
          {workspaceName}
        </h2>

        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2 text-sm">
            <Button variant="secondary">Top Rated</Button>
            <Button variant="default" className="text-zinc-400">
              Pending Updates
            </Button>
          </div>

          <Button
            variant="primary"
            onClick={() => setIsAddPromptModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> New Prompt
          </Button>
        </div>

        <div className="overflow-y-auto prompt-feed-list space-y-3 pr-2">
          {prompts.length > 0 ? (
            prompts.map((p) => (
              <PromptCard
                key={p._id}
                id={p._id}
                task={p.title}
                upvotes={p.upvotes ?? p.upvote ?? 0}
                onClick={() => onPromptSelect(p._id)}
                isUpvoted={userUpvotedSet.has(p._id)}
                onUpvote={() => handleUpvote(p._id)}
              />
            ))
          ) : (
            <p className="text-zinc-500 p-4">
              No prompts found in this workspace yet.
            </p>
          )}
        </div>
      </div>

      <AddPromptModal
        isOpen={isAddPromptModalOpen}
        onClose={() => setIsAddPromptModalOpen(false)}
        workspaceId={selectedWorkspaceId}
        workspaceName={workspaceName}
        onPromptAdded={handlePromptAdded}
      />
    </div>
  );
};

export default LibraryView;
