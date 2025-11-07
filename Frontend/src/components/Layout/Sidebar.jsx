import { Zap, Home, HardHat, FileText, Compass, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

const NavItem = ({ Icon, name, isActive, onClick, isDropdown = false, isOpen = false }) => (
  <a
    href="#"
    onClick={onClick}
    className={`flex items-center p-3 rounded-lg transition text-sm ${
      isActive ? 'bg-accent-teal text-white font-semibold' : 'text-white hover:bg-zinc-800'
    } ${isDropdown ? 'justify-between' : ''}`}
  >
    <span className="flex items-center">
      <Icon className="mr-3 w-5 h-5" />
      {name}
    </span>
    {isDropdown && (isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
  </a>
);

const Sidebar = ({ currentPage, setCurrentPage, setSelectedWorkspaceId, workspaces = [], onOpenAddWorkspaceModal }) => {
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

  const handleWorkspaceSelect = (id) => {
    setSelectedWorkspaceId(id);
    setCurrentPage('library');
    setIsWorkspaceOpen(false);
  };

  return (
    <aside className="bg-surface-card h-full p-4 flex flex-col justify-between w-64 flex-shrink-0">
      <div>
        <div className="text-3xl font-bold mb-8 flex items-center text-accent-teal">
          <Zap className="mr-2 w-6 h-6" /> promptly
        </div>

        <nav className="space-y-2 text-sm">
          <NavItem Icon={Home} name="Home" isActive={currentPage === 'dashboard'} onClick={() => setCurrentPage('dashboard')} />

          {/* My Workspace dropdown */}
          <NavItem
            Icon={HardHat}
            name="My Workspace"
            isActive={currentPage === 'library'}
            isDropdown={true}
            isOpen={isWorkspaceOpen}
            onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
          />

          {/* Dropdown list */}
          {isWorkspaceOpen && (
            <div className="pl-6 space-y-1">
              {workspaces.length > 0 ? (
                workspaces.map((ws) => (
                  <a
                    key={ws._id || ws.id}
                    href="#"
                    onClick={() => handleWorkspaceSelect(ws._id || ws.id)}
                    className="block p-2 rounded-lg text-zinc-300 hover:bg-zinc-700 transition"
                  >
                    {ws.title || ws.name}
                  </a>
                ))
              ) : (
                <p className="text-zinc-500 text-sm italic pl-2">No workspaces yet</p>
              )}
            </div>
          )}

          <NavItem Icon={FileText} name="Requests" isActive={currentPage === 'requests'} onClick={() => setCurrentPage('requests')} />
          <NavItem Icon={Compass} name="Explore" isActive={currentPage === 'explore'} onClick={() => setCurrentPage('explore')} />
        </nav>
      </div>

      {/* Bottom section */}
      <div className="mt-8">
        <button
          className="flex items-center p-3 rounded-lg text-white hover:bg-zinc-800 transition w-full text-sm"
          onClick={onOpenAddWorkspaceModal}
        >
          <Plus className="mr-3 w-5 h-5" /> Add Workspace
        </button>

        <div className="flex items-center justify-between p-3 mt-4 bg-surface-secondary rounded-xl">
          <span className="text-sm">John Doe</span>
          <div className="w-8 h-8 rounded-full bg-accent-teal flex items-center justify-center text-xs text-white">JD</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
