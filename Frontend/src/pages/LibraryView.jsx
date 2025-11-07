// src/pages/LibraryView.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import PromptCard from "../components/Common/PromptCard";
import { Plus } from "lucide-react";
import Button from "../components/Common/Button";
import AddPromptModal from "../components/Modals/AddpromptModal"; // ✅ fixed import

const LibraryView = ({ onPromptSelect, selectedWorkspaceId }) => {
  const [prompts, setPrompts] = useState([]);
  const [workspaceName, setWorkspaceName] = useState("Loading...");
  const [isAddPromptModalOpen, setIsAddPromptModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch workspace + prompts from backend
  useEffect(() => {
    const fetchWorkspacePrompts = async () => {
      if (!selectedWorkspaceId) return;
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5000/api/workspaces", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const workspace = data.find((w) => w._id === selectedWorkspaceId);
        if (workspace) {
          setPrompts(workspace.prompts || []);
          setWorkspaceName(workspace.title);
        } else {
          setWorkspaceName("Unknown Workspace");
        }
      } catch (error) {
        console.error("Error fetching workspace prompts:", error);
        setWorkspaceName("Error loading workspace");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspacePrompts();
  }, [selectedWorkspaceId]);

  // ✅ Handler for adding new prompt (updates UI instantly)
  const handlePromptAdded = (newPrompt) => {
    setPrompts((prev) => [...prev, newPrompt]);
    console.log(newPrompt._id);
  };

  if (loading) return <p className="text-zinc-400 p-4">Loading workspace...</p>;

  return (
    <div className="flex h-full -mt-8">
      <div className="w-full pr-6 flex flex-col">
        <h2 className="text-3xl font-semibold text-text-primary mb-4">
          {workspaceName}
        </h2>

        {/* --- Toolbar --- */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2 text-sm">
            <Button variant="secondary">Top Rated</Button>
            <Button variant="default" className="text-zinc-400">
              Pending Updates
            </Button>
          </div>

          {/* Open Add Prompt Modal */}
          <Button
            variant="primary"
            onClick={() => setIsAddPromptModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> New Prompt
          </Button>
        </div>

        {/* --- Prompt Feed --- */}
        <div className="overflow-y-auto prompt-feed-list space-y-3 pr-2">
          {prompts.length > 0 ? (
           
            prompts.map((p) => (
                
              <PromptCard
                key={p._id}
                id={p._id}
                task={p.title}
                upvotes={p.upvote || 0}
                onClick={() => onPromptSelect(p._id)}
                isUpvoted={false}
                onUpvote={null}
              />
            ))
          ) : (
            <p className="text-zinc-500 p-4">
              No prompts found in this workspace yet.
            </p>
          )}
        </div>
      </div>

      {/* Add Prompt Modal */}
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
