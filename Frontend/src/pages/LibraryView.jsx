// src/pages/LibraryView.jsx
import React, { useState } from 'react';
import PromptCard from '../components/Common/PromptCard';
import { Plus } from 'lucide-react';
import Button from '../components/Common/Button';

// Sample Data (Initialized with mutable state for demonstration)
const initialPrompts = [
    { id: 1, task: "Next.js Component with Tailwind", upvotes: 45, creator: "Alice Johnson", isUpvoted: false },
    { id: 2, task: "Kubernetes Deployment YAML Generator", upvotes: 38, creator: "Bob Johnson", isUpvoted: false },
    { id: 3, task: "Advanced SQL Join Query", upvotes: 35, creator: "Charlie Brown", isUpvoted: false },
    { id: 4, task: "Functional Component Unit Test Template", upvotes: 29, creator: "Alice Johnson", isUpvoted: false },
];

const LibraryView = ({ onPromptSelect, selectedWorkspaceId, searchQuery }) => {
    
    const [prompts, setPrompts] = useState(initialPrompts); // State to hold prompt data
    
    const workspaceName = selectedWorkspaceId === 1 ? "Dev Team Prompts" : "Selected Workspace";

    // NEW: Upvote Handler
    const handleUpvote = (id) => {
        setPrompts(prevPrompts => 
            prevPrompts.map(p => {
                if (p.id === id) {
                    const newUpvotes = p.isUpvoted ? p.upvotes - 1 : p.upvotes + 1;
                    return {
                        ...p,
                        upvotes: newUpvotes,
                        isUpvoted: !p.isUpvoted,
                    };
                }
                return p;
            })
        );
        // In a real app: API call (e.g., POST /api/prompts/{id}/upvote)
        console.log(`Prompt ${id} upvote state toggled.`);
    };

    // Filtering logic based on searchQuery
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
                    <Button variant="primary">
                        <Plus className="w-4 h-4 mr-2" /> New Prompt
                    </Button>
                </div>
                <div className="overflow-y-auto prompt-feed-list space-y-3 pr-2">
                    {filteredPrompts.map((p) => (
                        <PromptCard 
                            key={p.id}
                            id={p.id} 
                            task={p.task}
                            upvotes={p.upvotes}
                            isUpvoted={p.isUpvoted} // Pass current upvote status
                            onClick={() => onPromptSelect(p.id)} 
                            onUpvote={() => handleUpvote(p.id)} // Pass the handler
                        />
                    ))}
                    {/* ... (empty state logic) ... */}
                </div>
            </div>
        </div>
    );
};

export default LibraryView;