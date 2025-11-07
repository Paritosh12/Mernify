// Frontend/src/pages/ExploreView.jsx
import React from 'react';
import { FileText, HardHat, ChevronsRight } from 'lucide-react';
import Button from '../components/Common/Button'; // Reusing your Button component

// Helper component for stat cards (updated to use custom colors)
const StatCard = ({ icon: Icon, title, value }) => (
  <div className="bg-surface-card p-6 rounded-xl shadow-lg flex flex-col items-start space-y-3 border border-zinc-700/50">
    <div className="p-3 bg-accent-teal/20 rounded-full">
      {/* Updated icon color to accent-teal for visual consistency */}
      <Icon className="w-6 h-6 text-accent-teal" /> 
    </div>
    <p className="text-sm font-medium text-zinc-400">{title}</p>
    {/* Use toLocaleString for pretty number formatting */}
    <h2 className="text-4xl font-bold text-white">{value.toLocaleString()}</h2>
  </div>
);

// Component for Workspaces on the Explore page
const ExploreWorkspaceCard = ({ workspace, onViewWorkspace }) => {
  return (
    <div className="bg-surface-card p-4 rounded-lg flex flex-col justify-between h-full hover:shadow-xl transition-shadow border border-zinc-700/50">
      <div>
        <h3 className="text-xl font-semibold text-white truncate mb-2">{workspace.title}</h3>
        <div className="text-zinc-400 text-sm mb-4">
          <FileText className="w-4 h-4 inline mr-2 text-accent-green" />
          {/* Green icon for prompt count, matching the button's visual cue */}
          {workspace.promptCount} {workspace.promptCount === 1 ? 'Prompt' : 'Prompts'}
        </div>
      </div>
      {/*  The Button uses variant="success", which maps to 'accent-green' 
             via the logic in src/components/Common/Button.jsx. */}
      <Button
        variant="success" 
        onClick={() => onViewWorkspace(workspace._id)}
        className="mt-auto w-full"
      >
        View Workspace <ChevronsRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};


const ExploreView = ({ stats, allWorkspaces = [], onViewWorkspace }) => {
// ... (rest of the component logic remains the same)
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-white">
        Explore 
      </h1>
      <p className="text-zinc-400 max-w-2xl">Discover the total collaboration efforts across the platform. This data is updated in real-time.</p>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          icon={FileText}
          title="Total Prompts Created"
          value={stats.totalPrompts}
        />
        <StatCard
          icon={HardHat}
          title="Total Workspaces Shared"
          value={stats.totalWorkspaces}
        />
      </div>

      {/* All Workspaces Section */}
      <div className="pt-8 space-y-4">
        <h2 className="text-3xl font-bold text-white">All Workspaces</h2>
        
        {allWorkspaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allWorkspaces.map((ws) => (
              <ExploreWorkspaceCard
                key={ws._id}
                workspace={ws}
                onViewWorkspace={onViewWorkspace}
              />
            ))}
          </div>
        ) : (
          <p className="text-zinc-500">No public workspaces found to display.</p>
        )}
      </div>
    </div>
  );
};

export default ExploreView;