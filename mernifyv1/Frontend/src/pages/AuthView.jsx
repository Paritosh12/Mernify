// src/pages/AuthView.jsx
import React, { useState } from 'react';
import { Zap, User, Lock, Mail, ArrowRight } from 'lucide-react';
import Button from '../components/Common/Button'; // Assuming Button is available for consistency

const AuthView = ({ onAuthSuccess }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        console.log(`Attempting ${isRegistering ? 'Registration' : 'Login'}...`);
        
        setTimeout(() => {
            setLoading(false);
            if (isRegistering) {
                setMessage("Registration successful! Please log in.");
                setIsRegistering(false);
            } else {
                onAuthSuccess(); 
            }
        }, 1500); 
    };

    const toggleForm = () => {
        setIsRegistering(prev => !prev);
        setMessage('');
        setUsername('');
        setEmail('');
        setPassword('');
    };

    const getFormTitle = isRegistering ? "Create Your Account" : "Welcome Back";
    
    // Class list for all inputs for consistency and clear focus state
    const inputClass = "w-full p-3 pl-10 bg-surface-secondary border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-accent-teal focus:border-accent-teal focus:outline-none";


    return (
        <div className="flex items-center justify-center min-h-screen bg-bg-primary p-4">
            <div className="bg-surface-card rounded-2xl shadow-2xl p-8 sm:p-12 w-full max-w-md border border-zinc-700">
                
                {/* Logo and Title */}
                <div className="text-center mb-10">
                    <Zap className="w-12 h-12 text-accent-teal mx-auto mb-3" strokeWidth={3} />
                    <h1 className="text-3xl font-extrabold text-text-primary mb-2">{getFormTitle}</h1>
                    <p className="text-zinc-400">
                        {isRegistering ? 'Join the prompt collaboration community.' : 'Sign in to continue to Promptly.'}
                    </p>
                </div>

                {/* Status Message */}
                {message && (
                    <div className={`p-3 rounded-lg text-sm mb-4 ${isRegistering ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Username Field (Register Only) */}
                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isRegistering ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={inputClass} // Applied fixed class
                                placeholder="e.g., john_doe"
                                required={isRegistering}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputClass} // Applied fixed class
                                placeholder="you@example.com"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={inputClass} // Applied fixed class
                                placeholder="••••••••"
                                required
                                minLength={6}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Submit Button (Fixed Glow) */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-accent-teal text-white font-bold rounded-xl 
                                   shadow-lg 
                                   shadow-accent-teal/50 
                                   hover:bg-teal-600 transition duration-300 ease-in-out flex items-center justify-center space-x-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <>
                                <span>{isRegistering ? "Register Now" : "Log In"}</span>
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </>
                        )}
                    </button>
                </form>

                {/* Toggle Link */}
                <div className="mt-6 text-center text-sm">
                    <span className="text-zinc-500">
                        {isRegistering ? "Already have an account?" : "Don't have an account?"}
                    </span>
                    <button
                        onClick={toggleForm}
                        className="text-accent-teal hover:text-teal-400 font-medium ml-2 transition"
                        disabled={loading}
                    >
                        {isRegistering ? "Sign In" : "Register Here"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthView;