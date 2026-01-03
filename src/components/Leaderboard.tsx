// ============================================
// Premium Leaderboard Component
// ============================================

import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/firestoreService';
import { LeaderboardEntry, UserRank } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Leaderboard: React.FC = () => {
    const { userProfile } = useAuth();
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState<'all' | 'month' | 'week'>('all');

    useEffect(() => {
        loadLeaderboard();
    }, [timeframe]);

    const loadLeaderboard = async () => {
        setLoading(true);
        try {
            const data = await getLeaderboard(20);
            setEntries(data);
        } catch (error) {
            console.error('Error loading leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (rank: number): string => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return '';
    };

    const getRankFromScore = (score: number): UserRank => {
        if (score >= 5000) return UserRank.CIVIC_GUARDIAN;
        if (score >= 2000) return UserRank.PLATINUM;
        if (score >= 1000) return UserRank.GOLD;
        if (score >= 500) return UserRank.SILVER;
        return UserRank.BRONZE;
    };

    const getRankColor = (rank: UserRank): string => {
        switch (rank) {
            case UserRank.CIVIC_GUARDIAN: return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
            case UserRank.PLATINUM: return 'bg-gradient-to-r from-slate-500 to-slate-400 text-white';
            case UserRank.GOLD: return 'bg-gradient-to-r from-amber-500 to-yellow-400 text-white';
            case UserRank.SILVER: return 'bg-gradient-to-r from-slate-400 to-slate-300 text-white';
            default: return 'bg-gradient-to-r from-amber-700 to-amber-600 text-white';
        }
    };

    const getRankBg = (index: number): string => {
        if (index === 0) return 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200';
        if (index === 1) return 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200';
        if (index === 2) return 'bg-gradient-to-r from-orange-50 to-amber-50 border-amber-200';
        return '';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <span className="text-2xl">🏆</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Civic Leaderboard</h3>
                        <p className="text-sm text-slate-400">Top contributors in Belagavi</p>
                    </div>
                </div>

                {/* Timeframe Toggle */}
                <div className="flex gap-1 bg-slate-100/80 backdrop-blur-sm p-1.5 rounded-xl border border-slate-200/50">
                    {[
                        { key: 'all', label: 'All Time' },
                        { key: 'month', label: 'Month' },
                        { key: 'week', label: 'Week' },
                    ].map((option) => (
                        <button
                            key={option.key}
                            onClick={() => setTimeframe(option.key as any)}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${timeframe === option.key
                                    ? 'bg-white text-blue-600 shadow-md'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Your Position Card */}
            {userProfile && (
                <div className="card overflow-hidden relative group">
                    <div className="civic-gradient p-6 text-white">
                        {/* Background Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    {userProfile.photoURL ? (
                                        <img
                                            src={userProfile.photoURL}
                                            alt={userProfile.displayName}
                                            className="w-14 h-14 rounded-xl border-2 border-white/30 shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                                            {userProfile.displayName[0]}
                                        </div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center text-xs border-2 border-white">
                                        ✓
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-white/60 font-medium">Your Position</p>
                                    <p className="font-bold text-xl">{userProfile.displayName}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${getRankColor(userProfile.rank)}`}>
                                            {userProfile.rank}
                                        </span>
                                        <span className="text-xs text-white/60">{userProfile.badges.length} badges</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-4xl font-bold tracking-tight">{userProfile.civicScore.toLocaleString()}</p>
                                <p className="text-sm text-white/60 font-medium">Civic Karma</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Leaderboard List */}
            <div className="card overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="relative w-12 h-12 mx-auto mb-4">
                            <div className="absolute inset-0 rounded-full border-4 border-blue-200" />
                            <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                        </div>
                        <p className="text-slate-400 font-medium">Loading leaderboard...</p>
                    </div>
                ) : (
                    <div>
                        {entries.map((entry, index) => (
                            <div
                                key={entry.userId}
                                className={`flex items-center gap-4 p-4 transition-all duration-300 hover:bg-slate-50 ${entry.userId === userProfile?.uid ? 'bg-blue-50/50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'
                                    } ${getRankBg(index)} ${index !== entries.length - 1 ? 'border-b border-slate-100' : ''}`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Rank */}
                                <div className="w-12 text-center">
                                    {entry.rank <= 3 ? (
                                        <div className="relative">
                                            <span className="text-3xl">{getRankIcon(entry.rank)}</span>
                                            {entry.rank === 1 && (
                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center animate-pulse">
                                                    <span className="text-[8px]">👑</span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-lg font-bold text-slate-400">#{entry.rank}</span>
                                    )}
                                </div>

                                {/* Avatar */}
                                <div className="relative">
                                    {entry.userPhotoURL ? (
                                        <img
                                            src={entry.userPhotoURL}
                                            alt={entry.userName}
                                            className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                            {entry.userName[0]}
                                        </div>
                                    )}
                                </div>

                                {/* Name & Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-slate-800 truncate">
                                            {entry.userName}
                                        </p>
                                        {entry.userId === userProfile?.uid && (
                                            <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full font-bold">
                                                YOU
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getRankColor(getRankFromScore(entry.civicScore))}`}>
                                            {getRankFromScore(entry.civicScore)}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {entry.badgeCount} badges • {entry.reportsThisMonth} reports
                                        </span>
                                    </div>
                                </div>

                                {/* Score */}
                                <div className="text-right">
                                    <p className="font-bold text-xl text-slate-800">{entry.civicScore.toLocaleString()}</p>
                                    <p className="text-xs text-slate-400 font-medium">karma pts</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* How to Earn Points Card */}
            <div className="card overflow-hidden">
                <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-b border-emerald-100">
                    <h4 className="font-bold text-emerald-800 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">💡</span>
                        How to Climb the Ranks
                    </h4>
                </div>
                <div className="p-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                            <span className="text-2xl">📸</span>
                            <div>
                                <p className="font-semibold text-slate-700 text-sm">Report Issue</p>
                                <p className="text-emerald-600 font-bold text-xs">+50 pts</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                            <span className="text-2xl">✅</span>
                            <div>
                                <p className="font-semibold text-slate-700 text-sm">Issue Resolved</p>
                                <p className="text-emerald-600 font-bold text-xs">+100 pts</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                            <span className="text-2xl">🔍</span>
                            <div>
                                <p className="font-semibold text-slate-700 text-sm">Verify Report</p>
                                <p className="text-emerald-600 font-bold text-xs">+25 pts</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                            <span className="text-2xl">🏅</span>
                            <div>
                                <p className="font-semibold text-slate-700 text-sm">Earn Badge</p>
                                <p className="text-emerald-600 font-bold text-xs">+Bonus!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
