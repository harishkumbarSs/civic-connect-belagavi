// ============================================
// Header Component
// ============================================

import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
    activeTab?: string;
    onTabChange?: (tab: any) => void;
    isAdmin?: boolean;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, isAdmin }) => {
    const { user, userProfile, signOut } = useAuth();

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 civic-gradient rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                        C
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800">
                            CivicConnect <span className="text-blue-600">Belagavi</span>
                        </h1>
                        <p className="text-[10px] text-slate-400 font-medium -mt-0.5">
                            Snap • Speak • Solved
                        </p>
                    </div>
                </div>

                {/* User Menu */}
                {user && (
                    <div className="flex items-center gap-4">
                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-6">
                            <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                                About
                            </a>
                            <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                                Help
                            </a>
                            {isAdmin && (
                                <span className="badge-info">Admin</span>
                            )}
                        </nav>

                        {/* User Avatar & Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 transition-colors">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={user.displayName || 'User'}
                                        className="w-8 h-8 rounded-full border-2 border-slate-200"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                                        {(user.displayName || 'U')[0].toUpperCase()}
                                    </div>
                                )}
                                <div className="hidden sm:block text-left">
                                    <p className="text-sm font-medium text-slate-700 truncate max-w-[100px]">
                                        {user.displayName || 'Citizen'}
                                    </p>
                                    {userProfile && (
                                        <p className="text-[10px] text-blue-600 font-semibold">
                                            {userProfile.civicScore} pts • {userProfile.rank}
                                        </p>
                                    )}
                                </div>
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-white rounded-xl shadow-xl border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <div className="px-4 py-2 border-b border-slate-100">
                                    <p className="text-sm font-medium text-slate-800">{user.displayName}</p>
                                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                </div>
                                <button
                                    onClick={signOut}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
