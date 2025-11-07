// src/components/Dashboard/ActiveWorkspaces.jsx
import React from 'react';
import WorkspaceTile from '../Common/WorkspaceTile';

// Mock Data
const workspaces = [
    { id: 1, name: "Dev Team Prompts", prompts: 45 },
    { id: 2, name: "Marketing Campaigns", prompts: 12 },
    { id: 3, name: "Hackathon Squad", prompts: 8 },
    { id: 4, name: "Personal Code Snippets", prompts: 88 },
    { id: 5, name: "Data Science Models", prompts: 22 },
];

const ActiveWorkspaces = ({ onViewWorkspace, searchQuery , setCurrentPage}) => {

    // Filtering logic based on searchQuery
    const filteredWorkspaces = workspaces.filter(ws => 
        ws.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const handleWorkspaceSelect = () => {
         // Update selected workspace state
        setCurrentPage('library'); // Navigate to the library view
    };

    return (
        <section>
            <h2 className="text-2xl font-semibold mb-4 text-text-primary">My Active Workspaces</h2>
            <div className="flex space-x-4 overflow-x-auto pb-4">
                {filteredWorkspaces.map((ws) => ( // Render filtered list
                    <WorkspaceTile 
                        key={ws.id} 
                        name={ws.name} 
                        prompts={ws.prompts}
                        onClick={() => {
                            handleWorkspaceSelect();
                            onViewWorkspace(ws.id);
                            
                        }} 
                    />
                ))}
                {filteredWorkspaces.length === 0 && searchQuery && (
                    <p className="text-zinc-500 p-4">No workspaces found matching "{searchQuery}"</p>
                )}
            </div>
        </section>
    );
};

export default ActiveWorkspaces;