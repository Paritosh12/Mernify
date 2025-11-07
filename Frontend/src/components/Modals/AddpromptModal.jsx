import React, { useState } from 'react';
import { X, FileText, Plus } from 'lucide-react';

const AddPromptModal = ({ isOpen, onClose, onSave, workspaceName }) => {
    const [taskName, setTaskName] = useState('');
    const [promptContent, setPromptContent] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!taskName.trim() || !promptContent.trim()) return;

        setLoading(true);
        
        // Simulate API call delay
        setTimeout(() => {
            onSave(taskName.trim(), promptContent.trim());
            setLoading(false);
            setTaskName('');
            setPromptContent('');
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-surface-card rounded-xl p-8 w-full max-w-2xl shadow-2xl relative border border-zinc-700">
                <h2 className="text-2xl font-semibold text-text-primary mb-6 flex items-center">
                    <FileText className="w-6 h-6 mr-2 text-accent-teal" /> Create New Prompt 
                    <span className="text-base text-zinc-500 ml-3">({workspaceName})</span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Task Name (Title)</label>
                        <input
                            type="text"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            className="w-full p-3 bg-surface-secondary border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-accent-teal focus:border-accent-teal focus:outline-none"
                            placeholder="e.g., Optimized Next.js Component Fetcher"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Prompt Content / Instructions</label>
                        <textarea
                            value={promptContent}
                            onChange={(e) => setPromptContent(e.target.value)}
                            className="w-full p-3 bg-surface-secondary border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-accent-teal focus:border-accent-teal focus:outline-none resize-y h-32"
                            placeholder="Provide detailed instructions for the LLM here..."
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded-lg bg-zinc-700 text-white font-semibold hover:bg-zinc-600 transition"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-accent-teal text-white font-semibold hover:bg-teal-600 transition flex items-center justify-center space-x-2"
                            disabled={loading || !taskName.trim() || !promptContent.trim()}
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" /> <span>Submit Prompt</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <button className="absolute top-4 right-4 text-white hover:text-zinc-400" onClick={onClose}>
                    <X className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default AddPromptModal;