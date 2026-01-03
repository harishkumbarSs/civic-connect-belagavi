// ============================================
// Premium Login Page Component
// ============================================

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
    const { signIn, loading, error } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await signIn();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen animated-gradient flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating Orbs */}
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl float"
                    style={{ animationDelay: '0s' }} />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl float"
                    style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl float"
                    style={{ animationDelay: '4s' }} />

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }} />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
            </div>

            <div className="relative w-full max-w-md z-10">
                {/* Logo Section */}
                <div className="text-center mb-10 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl shadow-2xl mb-8 relative">
                        <span className="text-5xl font-black gradient-text">C</span>
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl opacity-20 blur-lg" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
                        CivicConnect
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                            Belagavi
                        </span>
                    </h1>
                    <p className="text-blue-200/80 text-lg font-medium tracking-wide">
                        Snap • Speak • Solved
                    </p>
                </div>

                {/* Login Card */}
                <div className="glass rounded-3xl p-8 shadow-2xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">
                        Welcome, Citizen! 👋
                    </h2>
                    <p className="text-slate-500 text-center mb-8">
                        Report civic issues & earn Karma points
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm animate-scale-in">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Google Sign In Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading || loading}
                        className="w-full group relative flex items-center justify-center gap-3 py-4 px-6 bg-white rounded-2xl font-semibold text-slate-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex items-center gap-3">
                            {isLoading || loading ? (
                                <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            )}
                            <span className="text-base">Continue with Google</span>
                        </div>
                    </button>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white/80 text-slate-400 font-medium">Quick Access</span>
                        </div>
                    </div>

                    {/* Demo Info */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">🎮</span>
                            <div>
                                <p className="font-semibold text-slate-700 mb-1">Demo Mode Active</p>
                                <p className="text-sm text-slate-500">
                                    Click above to explore the app with sample data
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="mt-8 grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="glass-dark rounded-2xl p-4 text-center group hover:scale-105 transition-transform duration-300 cursor-pointer">
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📸</div>
                        <p className="text-xs text-blue-200 font-medium">Snap & Report</p>
                    </div>
                    <div className="glass-dark rounded-2xl p-4 text-center group hover:scale-105 transition-transform duration-300 cursor-pointer">
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🤖</div>
                        <p className="text-xs text-blue-200 font-medium">AI Analysis</p>
                    </div>
                    <div className="glass-dark rounded-2xl p-4 text-center group hover:scale-105 transition-transform duration-300 cursor-pointer">
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏆</div>
                        <p className="text-xs text-blue-200 font-medium">Earn Points</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-6 flex justify-center gap-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-white">500+</p>
                        <p className="text-xs text-blue-300/70">Issues Resolved</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-white">2K+</p>
                        <p className="text-xs text-blue-300/70">Active Citizens</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-white">24hr</p>
                        <p className="text-xs text-blue-300/70">Avg Response</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-10 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <p className="text-blue-200/50 text-xs">
                        Built for TechSprint Belgaum 2025
                    </p>
                    <div className="flex justify-center gap-4 mt-2">
                        <span className="px-2 py-1 rounded-full bg-white/10 text-[10px] text-blue-200/70">SDG 11</span>
                        <span className="px-2 py-1 rounded-full bg-white/10 text-[10px] text-blue-200/70">SDG 16</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
