import React, { useState } from "react";
import { X, HardHat, Plus } from "lucide-react";
import api from "../../api/axiosConfig"; 

const AddWorkspaceModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError("");

    try {
      // 🔹 POST request to backend
      const { data } = await api.post("/workspaces", { title: name.trim() });

      // 🔹 Notify parent (App.jsx) to update UI
      onSave(data);
      setName("");
      onClose();
    } catch (err) {
      console.error("Error creating workspace:", err);
      setError(err.response?.data?.message || "Failed to create workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-surface-card rounded-xl p-8 w-full max-w-md shadow-2xl relative border border-zinc-700">
        <h2 className="text-2xl font-semibold text-text-primary mb-6 flex items-center">
          <HardHat className="w-6 h-6 mr-2 text-accent-teal" /> Add New Workspace
        </h2>

        {error && (
          <div className="mb-3 p-2 bg-red-900/30 border border-red-700 text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Workspace Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-surface-secondary border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-accent-teal focus:border-accent-teal focus:outline-none"
              placeholder="e.g., My New Project Team"
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
              disabled={loading || !name.trim()}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> <span>Create</span>
                </>
              )}
            </button>
          </div>
        </form>

        <button
          className="absolute top-4 right-4 text-white hover:text-zinc-400"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default AddWorkspaceModal;
