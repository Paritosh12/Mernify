// src/components/Layout/Header.jsx
import React from 'react';
import { Search, LogOut } from 'lucide-react'; // Import LogOut icon
import Button from '../Common/Button'; // Use the reusable Button component

// Accept the new onLogout prop
const Header = ({ currentPage, searchQuery, setSearchQuery, onLogout }) => {
    
    // Determine the placeholder text based on the current page
    let placeholderText = "Search Active Workspace";
    if (currentPage === 'library') {
        placeholderText = "Search Prompt";
    } else if (currentPage === 'prompt-detail') {
        // Search is generally not available or needed on the detail page
        return (
            <header className="h-16 flex items-center justify-end px-2 mb-8">
                 {/* LOGOUT BUTTON FOR DETAIL PAGE */}
                <Button variant="outline" onClick={onLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Button>
            </header>
        ); 
    }

    // We assume if Header is rendered outside AuthView, the user IS authenticated.
    // The previous isAuthenticated check is now unnecessary here
    const isAuthenticated = onLogout !== undefined; 

    return (
        <header className="h-16 flex items-center justify-between px-2 mb-8">
            <div className="flex-1 max-w-lg">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder={placeholderText} 
                        className="w-full p-3 pl-10 bg-surface-secondary rounded-xl text-sm border-none focus:ring-2 focus:ring-accent-teal focus:outline-none"
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                </div>
            </div>
            
            {/* LOGOUT BUTTON FOR DASHBOARD/LIBRARY */}
            {isAuthenticated && (
                 <Button variant="outline" onClick={onLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Button>
            )}

            {/* Previous Log In/Sign Up placeholder removed/simplified */}
        </header>
    );
};

export default Header;