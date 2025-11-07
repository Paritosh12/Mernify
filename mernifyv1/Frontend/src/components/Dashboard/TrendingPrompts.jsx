// src/components/Dashboard/TrendingPrompts.jsx
import React, { useState } from 'react'; // 🌟 FIX 1: Import useState
import PromptCard from '../Common/PromptCard';

// Mock Data
const initialTrendingPrompts = [
    { id: 1, task: "Advanced Python Web Scraper Setup", upvotes: 215, isUpvoted: false },
    { id: 2, task: "Optimized SQL Indexing Strategy", upvotes: 188, isUpvoted: false },
    { id: 3, task: "Tailwind Config for Dark Mode", upvotes: 152, isUpvoted: false },
    { id: 4, task: "Generate Creative Blog Post Titles", upvotes: 110, isUpvoted: false },
];


const TrendingPrompts = ({ onPromptClick }) => {
    // 🌟 FIX 2: Initialize the prompt list in local state
    const [prompts, setPrompts] = useState(initialTrendingPrompts); 

    const handleUpvote = (id) => {
        // 🌟 FIX 3: Use the local state setter (setPrompts)
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
        console.log(`Trending Prompt ${id} upvote state toggled.`);
    };

    return (
        <section>
            <h2 className="text-2xl font-semibold mb-4 text-text-primary">Trending Prompts</h2>
            <div className="space-y-2">
                {prompts.map((p) => ( // Iterate over the state variable 'prompts'
                    <PromptCard 
                        key={p.id}
                        id={p.id} 
                        task={p.task}
                        upvotes={p.upvotes}
                        isUpvoted={p.isUpvoted}
                        // Use onPromptClick prop for opening the detail page
                        onClick={() => onPromptClick(p.id)} 
                        onUpvote={() => handleUpvote(p.id)} 
                    />
                ))}
            </div>
        </section>
    );
};

export default TrendingPrompts;