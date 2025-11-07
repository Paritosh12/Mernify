// src/components/Layout/Header.jsx
import React from 'react';
import { Search } from 'lucide-react';

// The component now accepts state handlers as props
const Header = ({ currentPage, searchQuery, setSearchQuery }) => {
    
    // Determine the placeholder text based on the current page
    let placeholderText = "Search Active Workspace";
    if (currentPage === 'library') {
        placeholderText = "Search Prompt";
    } else if (currentPage === 'prompt-detail') {
        // Search is generally not available or needed on the detail page
        return null; 
    }

    // We hide auth buttons when logged in (as assumed for the main views)
    const isAuthenticated = true; 

    return (
        <header className="h-16 flex items-center justify-between px-2 mb-8">
            <div className="flex-1 max-w-lg">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder={placeholderText} 
                        className="w-full p-3 pl-10 bg-surface-secondary rounded-xl text-sm border-none focus:ring-2 focus:ring-accent-teal focus:outline-none"
                        value={searchQuery} // Controlled input value
                        onChange={(e) => setSearchQuery(e.target.value)} // Update state on change
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                </div>
            </div>
            
            {/* Log In/Sign Up placeholder */}
            {!isAuthenticated && (
                 <div className="space-x-4">
                    <button className="px-5 py-2 rounded-lg bg-accent-teal text-white font-semibold">Log in</button>
                    <button className="px-5 py-2 rounded-lg border border-white text-white font-semibold hover:bg-zinc-700 transition">Sign up</button>
                </div>
            )}
        </header>
    );
};

export default Header;