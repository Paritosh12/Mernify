// src/App.jsx
import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import LibraryView from './pages/LibraryView';
import PromptDetailPage from './pages/PromptDetailPage'; // New Import
import ReviewRequestModal from './components/Modals/ReviewRequestModal';
import AuthView from './pages/AuthView';
import AddWorkspaceModal from './components/Modals/AddWorkspaceModal';

const initialWorkspaces = [
    { id: 1, name: "Dev Team Prompts" },
    { id: 2, name: "Marketing Campaigns" },
    { id: 3, name: "Hackathon Squad" },
];


const App = () => {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);
    // New state to manage selected workspace and prompt viewing
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(1);
    const [viewingPromptId, setViewingPromptId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [isAuthenticated, setIsAuthenticated] = useState(false); 
    const [workspaces, setWorkspaces] = useState(initialWorkspaces);
    const [isAddWorkspaceModalOpen, setIsAddWorkspaceModalOpen] = useState(false);


    const handleAuthSuccess = () => {
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
    };
    const handlePageChange = (page) => {
        
            if (page !== currentPage) {
                setSearchQuery(''); // Reset search when switching main views
                setCurrentPage(page); 
            }
    
            setViewingPromptId(null);
    
            if (page === 'requests') {
                setIsModalOpen(true);
                setCurrentPage('dashboard');
            } else {
                setIsModalOpen(false);
            }
    };
    
    const handlePromptSelect = (promptId) => {
        setCurrentPage('prompt-detail');
        setViewingPromptId(promptId);
    };
    
    const handleBackToLibrary = () => {
        setCurrentPage('library');
        setViewingPromptId(null);
    };

    const handleViewWorkspace = (workspaceId) => {
      setSelectedWorkspaceId(workspaceId);
      setCurrentPage('library');
    };

    const handleAddWorkspace = (name) => {
        const newWorkspace = {
            id: Date.now(), // Simple unique ID
            name: name,
        };
        setWorkspaces(prev => [...prev, newWorkspace]);
    };


    const renderPage = () => {
        if (viewingPromptId) {
            // Render the dedicated prompt detail page
            return <PromptDetailPage goBackToLibrary={handleBackToLibrary} />;
        }
        
        switch (currentPage) {
            case 'dashboard':
              return <Dashboard 
                    showRequests={() => setIsModalOpen(true)} 
                    onPromptClick={() => handlePromptSelect(1)}
                    //  PASSING THE NEW HANDLER TO THE DASHBOARD
                    onViewWorkspace={handleViewWorkspace}
                    setCurrentPage={handlePageChange}
                    searchQuery={searchQuery}
              />;
            case 'requests':
                console.log(currentPage);
                // Dashboard now passes the select handler to navigate to the new detail view
                return <ReviewRequestModal
                isOpen={isModalOpen} 
                onClose={() => {
                  
                  setIsModalOpen(false);
                                
                }} 
                  // Mock select for trending
                />;
            case 'library':
                return <LibraryView 
                    onPromptSelect={handlePromptSelect} 
                    selectedWorkspaceId={selectedWorkspaceId}
                    searchQuery={searchQuery}
                    workspaces={workspaces}
                />;
            case 'prompt-detail': // <--- NEW CASE ADDED HERE
            return <PromptDetailPage 
                goBackToLibrary={handleBackToLibrary} 
                // In a real app, you would pass the actual prompt data based on viewingPromptId
            />;

            default:
                return <Dashboard showRequests={() => setIsModalOpen(true)} onPromptClick={() => handlePromptSelect(1)} />;
        }
    };

    return (
        <div id="app" className="font-inter">
            {!isAuthenticated ? (
                <AuthView onAuthSuccess={handleAuthSuccess} />
            ) : (
                <div className="flex h-screen overflow-hidden bg-bg-primary">
                    <Sidebar 
                        currentPage={currentPage} 
                        setCurrentPage={handlePageChange}
                        setSelectedWorkspaceId={setSelectedWorkspaceId} 
                        //new
                        workspaces={workspaces}
                        onOpenAddWorkspaceModal={() => setIsAddWorkspaceModalOpen(true)}
                    />

                    <main id="main-content" className="flex-1 p-8 overflow-y-auto">
                        <Header 
                            currentPage={currentPage} 
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
                        <div id="page-content" className="w-full">
                            {renderPage()}
                        </div>
                    </main>
                    
                    <ReviewRequestModal 
                        isOpen={isModalOpen} 
                        onClose={() => {setIsModalOpen(false);}} 
                    />
                    <AddWorkspaceModal 
                        isOpen={isAddWorkspaceModalOpen}
                        onClose={() => setIsAddWorkspaceModalOpen(false)}
                        onSave={handleAddWorkspace}
                    />
                </div>
            )}
        </div>
    );
};

export default App;