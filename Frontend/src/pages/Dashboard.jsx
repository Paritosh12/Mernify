// src/pages/Dashboard.jsx
import React from 'react';
import ActiveWorkspaces from '../components/Dashboard/ActiveWorkspaces';
import PendingUpdatesPreview from '../components/Dashboard/PendingUpdatesPreview';
import TrendingPrompts from '../components/Dashboard/TrendingPrompts';

// Component now accepts searchQuery
const Dashboard = ({ showRequests, onPromptClick, onViewWorkspace, searchQuery ,setCurrentPage}) => {
    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-text-primary">Welcome back, John Doe</h1>
            
            {/* PASSING searchQuery to ActiveWorkspaces */}
            <ActiveWorkspaces onViewWorkspace={onViewWorkspace} searchQuery={searchQuery} setCurrentPage={setCurrentPage}/>

            <PendingUpdatesPreview showRequests={showRequests} />

            <TrendingPrompts onPromptClick={onPromptClick} />
        </div>
    );
};

export default Dashboard;