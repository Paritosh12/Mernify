import React, { useState } from 'react';
// FIX: Corrected import path to components/Common
import PromptCard from '../components/Common/PromptCard'; 
import { Plus } from 'lucide-react';
// FIX: Corrected import path to components/Common
import Button from '../components/Common/Button';
// FIX: Corrected import path to components/Modals
import AddPromptModal from '../components/Modals/AddpromptModal.jsx'; 

// Sample Data (Initialized with mutable state for demonstration)
const initialPrompts = [
    { id: 1, task: "Next.js Component with Tailwind", upvotes: 45, creator: "Alice Johnson", isUpvoted: false, content: "Mock content 1" },
    { id: 2, task: "Kubernetes Deployment YAML Generator", upvotes: 38, creator: "Bob Johnson", isUpvoted: false, content: "Mock content 2" },
    { id: 3, task: "Advanced SQL Join Query", upvotes: 35, creator: "Charlie Brown", isUpvoted: false, content: "Mock content 3" },
    { id: 4, task: "Functional Component Unit Test Template", upvotes: 29, creator: "Alice Johnson", isUpvoted: false, content: "Mock content 4" },
];

// UPDATED: Now includes Add Prompt Modal state
const LibraryView = ({ onPromptSelect, selectedWorkspaceId, searchQuery, workspaces }) => {
    
    const [prompts, setPrompts] = useState(initialPrompts); 
    const [isAddPromptModalOpen, setIsAddPromptModalOpen] = useState(false); // 🌟 NEW STATE

    // Determine the workspace name (for display only)
    const currentWorkspace = workspaces.find(ws => ws.id === selectedWorkspaceId) || { name: 'Unknown Workspace' };
    const workspaceName = currentWorkspace.name;

    // --- Upvote Handler ---
    const handleUpvote = (id) => {
        setPrompts(prevPrompts => 
            prevPrompts.map(p => {
                if (p.id === id) {
                    const newUpvotes = p.isUpvoted ? p.upvotes - 1 : p.upvotes + 1;
                    return { ...p, upvotes: newUpvotes, isUpvoted: !p.isUpvoted };
                }
                return p;
            })
        );
    };

    // --- Add Prompt Handler ---
    const handleAddPrompt = (task, content) => {
        const newPrompt = {
            id: Date.now(),
            task: task,
            upvotes: 0,
            creator: 'John Doe', // Assuming current user
            isUpvoted: false,
            content: content
        };
        setPrompts(prevPrompts => [newPrompt, ...prevPrompts]); // Add to the top
    };

    // --- Filtering Logic ---
    const filteredPrompts = prompts.filter(p =>
        p.task.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-full -mt-8">
            <div className="w-full pr-6 flex flex-col">
                <h2 className="text-3xl font-semibold text-text-primary mb-4">{workspaceName}</h2>
                
                <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-2 text-sm">
                        <Button variant="secondary">Top Rated</Button>
                        <Button variant="default" className="text-zinc-400">Pending Updates</Button>
                    </div>
                    {/* 🌟 BUTTON TO OPEN NEW PROMPT MODAL */}
                    <Button variant="primary" onClick={() => setIsAddPromptModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" /> New Prompt
                    </Button>
                </div>
                
                {/* --- Prompt Feed --- */}
                <div className="overflow-y-auto prompt-feed-list space-y-3 pr-2">
                    {filteredPrompts.length > 0 ? (
                        filteredPrompts.map((p) => (
                            <PromptCard 
                                key={p.id} 
                                task={p.task}
                                upvotes={p.upvotes}
                                isUpvoted={p.isUpvoted}
                                onClick={() => onPromptSelect(p.id)} 
                                onUpvote={() => handleUpvote(p.id)}
                            />
                        ))
                    ) : (
                        <p className="text-zinc-500 p-4">
                            {searchQuery 
                                ? `No prompts found matching "${searchQuery}".` 
                                : "There are no prompts in this workspace yet."}
                        </p>
                    )}
                </div>
            </div>

            {/*  NEW PROMPT MODAL RENDER */}
            <AddPromptModal 
                isOpen={isAddPromptModalOpen}
                onClose={() => setIsAddPromptModalOpen(false)}
                onSave={handleAddPrompt}
                workspaceName={workspaceName}
            />
        </div>
    );
};

export default LibraryView;