// src/App.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import Dashboard from "./pages/Dashboard";
import LibraryView from "./pages/LibraryView";
import PromptDetailPage from "./pages/PromptDetailPage";
import ReviewRequestModal from "./components/Modals/ReviewRequestModal";
import AuthView from "./pages/AuthView";
import AddWorkspaceModal from "./components/Modals/AddWorkspaceModal";
import api from "./api/axiosConfig"; // 🔹 Global axios instance with token interceptor

const App = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
  const [viewingPromptId, setViewingPromptId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [workspaces, setWorkspaces] = useState([]);
  const [isAddWorkspaceModalOpen, setIsAddWorkspaceModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  // ✅ Load workspaces once authenticated
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const { data } = await api.get("/workspaces");
        setWorkspaces(data);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };

    if (isAuthenticated) fetchWorkspaces();
  }, [isAuthenticated]);

  // ✅ Called when user logs in successfully
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage("dashboard");
  };

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setSearchQuery("");
      setCurrentPage(page);
    }
    setViewingPromptId(null);
    if (page === "requests") {
      setIsModalOpen(true);
      setCurrentPage("dashboard");
    } else {
      setIsModalOpen(false);
    }
  };

  const handlePromptSelect = (promptId) => {
    setCurrentPage("prompt-detail");
    setViewingPromptId(promptId);
  };

  const handleBackToLibrary = () => {
    setCurrentPage("library");
    setViewingPromptId(null)
  };

  const handleViewWorkspace = (workspaceId) => {
    setSelectedWorkspaceId(workspaceId);
    setCurrentPage("library");
  };
  
  //  When a new workspace is created (from modal)
  const handleAddWorkspace = (newWorkspace) => {
    setWorkspaces((prev) => [...prev, newWorkspace]);
  };

  useEffect(() => {
  const fetchPrompt = async () => {
    if (!viewingPromptId) return;
    try {
      const { data } = await api.get(`/prompts/${viewingPromptId}`);
      setSelectedPrompt(data);
    } catch (error) {
      console.error("Error fetching prompt details:", error);
    }
  };

  fetchPrompt();
}, [viewingPromptId]);

  const renderPage = () => {
   

    switch (currentPage) {
      case "dashboard":
        return (
          <Dashboard
            showRequests={() => setIsModalOpen(true)}
            onPromptClick={() => handlePromptSelect(viewingPromptId)}
            onViewWorkspace={handleViewWorkspace}
            setCurrentPage={handlePageChange}
            searchQuery={searchQuery}
          />
        );
      case "requests":
        return (
          <ReviewRequestModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        );
      case "library":
        return (
          <LibraryView
            

            onPromptSelect={handlePromptSelect}
            selectedWorkspaceId={selectedWorkspaceId}
            searchQuery={searchQuery}
            workspaces={workspaces}
          />
        );
      case "prompt-detail":
        console.log("i come here");
        console.log(selectedPrompt)
        console.log(viewingPromptId)
        return <PromptDetailPage 
        prompt={selectedPrompt}
        goBackToLibrary={handleBackToLibrary} />;
      default:
        return (
          <Dashboard
            showRequests={() => setIsModalOpen(true)}
            onPromptClick={() => handlePromptSelect(viewingPromptId)}
          />
        );
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
            onClose={() => setIsModalOpen(false)}
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
