// ============================================
// Premium Header Component
// ============================================

import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
    activeTab?: string;
    onTabChange?: (tab: any) => void;
    isAdmin?: boolean;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, isAdmin }) => {
    const { user, userProfile, signOut, isDemoMode } = useAuth();

    return (
        <header className="sticky top-0 z-50 glass border-b border-slate-200/50">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative">
                        <div className="w-11 h-11 civic-gradient rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-blue-500/30 transition-shadow duration-300">
                            C
                        </div>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300 -z-10" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 tracking-tight">
                            CivicConnect <span className="gradient-text">Belagavi</span>
                        </h1>
                        <p className="text-[10px] text-slate-400 font-medium -mt-0.5 tracking-wide">
                            Snap • Speak • Solved
                        </p>
                    </div>
                </div>

                {/* User Menu */}
                {user && (
                    <div className="flex items-center gap-4">
                        {/* Demo Badge */}
                        {isDemoMode && (
                            <span className="hidden sm:inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-xs font-semibold border border-amber-200/50 shadow-sm">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                                Demo
                            </span>
                        )}

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-1">
                            <a href="#" className="btn-ghost text-sm">About</a>
                            <a href="#" className="btn-ghost text-sm">Help</a>
                            {isAdmin && (
                                <span className="badge-info ml-2">
                                    <span className="w-1 h-1 bg-blue-500 rounded-full mr-1.5" />
                                    Admin
                                </span>
                            )}
                        </nav>

                        {/* User Avatar & Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-2.5 py-2 px-3 rounded-xl hover:bg-slate-100/80 transition-all duration-200 border border-transparent hover:border-slate-200/80">
                                <div className="relative">
                                    {user.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt={user.displayName || 'User'}
                                            className="w-9 h-9 rounded-xl border-2 border-white shadow-md object-cover"
                                        />
                                    ) : (
                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                            {(user.displayName || 'U')[0].toUpperCase()}
                                        </div>
                                    )}
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-sm font-semibold text-slate-700 truncate max-w-[100px]">
                                        {user.displayName || 'Citizen'}
                                    </p>
                                    {userProfile && (
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-bold text-blue-600">
                                                {userProfile.civicScore.toLocaleString()} pts
                                            </span>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600 font-medium">
                                                {userProfile.rank}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <svg className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute right-0 top-full mt-2 w-56 py-2 glass rounded-2xl shadow-xl border border-slate-200/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right scale-95 group-hover:scale-100">
                                <div className="px-4 py-3 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt={user.displayName || 'User'} className="w-10 h-10 rounded-xl" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                                {(user.displayName || 'U')[0]}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">{user.displayName}</p>
                                            <p className="text-xs text-slate-400 truncate max-w-[140px]">{user.email}</p>
                                        </div>
                                    </div>
                                </div>
                                {userProfile && (
                                    <div className="px-4 py-3 border-b border-slate-100">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500">Civic Score</span>
                                            <span className="font-bold text-blue-600">{userProfile.civicScore.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-xs mt-1">
                                            <span className="text-slate-500">Reports Filed</span>
                                            <span className="font-semibold text-slate-700">{userProfile.totalReports}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="px-2 pt-2">
                                    <button
                                        onClick={signOut}
                                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
