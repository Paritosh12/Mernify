// src/components/Common/PromptCard.jsx
import { ThumbsUp } from 'lucide-react';
import React from 'react';

// Added onUpvote and isUpvoted as props
const PromptCard = ({ id,task, upvotes, onClick, onUpvote, isUpvoted }) => { 
    
    // Style the upvote button based on whether the user has upvoted
    const upvoteClass = isUpvoted 
        ? 'text-accent-teal hover:text-teal-400' 
        : 'text-zinc-500 hover:text-accent-teal';

    return (
        <div 
            className="prompt-card bg-surface-card p-4 rounded-xl shadow-lg flex justify-between items-center cursor-pointer hover:border-l-4 border-accent-teal mb-3 transition" 
        >
            {/* Main content area triggers opening the detail page */}
            <div className="flex-1 min-w-0 pr-4" onClick={onClick}>
                <h4 className="text-base font-semibold text-text-primary truncate">{task}</h4>
            </div>
            
            {/* Upvote Button area */}
            <div 
                className={`flex items-center space-x-1 text-sm font-bold cursor-pointer transition ${upvoteClass}`}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent the card's onClick from triggering
                    onUpvote();
                }}
            >
                <ThumbsUp className="w-4 h-4" fill={isUpvoted ? 'currentColor' : 'none'} />
                <span>{upvotes}</span>
            </div>
        </div>
    );
};

export default PromptCard;