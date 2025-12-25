// ============================================
// Leaderboard Component
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
            // Demo data fallback
            setEntries([
                { rank: 1, userId: '1', userName: 'Rajesh Kumar', civicScore: 2450, reportsThisMonth: 18, badgeCount: 6 },
                { rank: 2, userId: '2', userName: 'Priya Patil', civicScore: 2100, reportsThisMonth: 15, badgeCount: 5 },
                { rank: 3, userId: '3', userName: 'Suresh Gowda', civicScore: 1850, reportsThisMonth: 12, badgeCount: 4 },
                { rank: 4, userId: '4', userName: 'Anita Desai', civicScore: 1500, reportsThisMonth: 10, badgeCount: 4 },
                { rank: 5, userId: '5', userName: 'Vikram Singh', civicScore: 1200, reportsThisMonth: 8, badgeCount: 3 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (rank: number): string => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
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
            case UserRank.CIVIC_GUARDIAN: return 'text-purple-600';
            case UserRank.PLATINUM: return 'text-slate-600';
            case UserRank.GOLD: return 'text-amber-500';
            case UserRank.SILVER: return 'text-slate-400';
            default: return 'text-amber-700';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🏆</span>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Civic Leaderboard</h3>
                        <p className="text-xs text-slate-400">Top civic contributors in Belagavi</p>
                    </div>
                </div>

                {/* Timeframe Toggle */}
                <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                    {[
                        { key: 'all', label: 'All Time' },
                        { key: 'month', label: 'This Month' },
                        { key: 'week', label: 'This Week' },
                    ].map((option) => (
                        <button
                            key={option.key}
                            onClick={() => setTimeframe(option.key as any)}
                            className={`px-4 py-2 text-xs font-medium rounded-md transition-all ${timeframe === option.key
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Your Position Card */}
            {userProfile && (
                <div className="card civic-gradient p-5 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {userProfile.photoURL ? (
                                <img
                                    src={userProfile.photoURL}
                                    alt={userProfile.displayName}
                                    className="w-12 h-12 rounded-full border-2 border-white/30"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                                    {userProfile.displayName[0]}
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-white/70">Your Ranking</p>
                                <p className="font-bold text-lg">{userProfile.displayName}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold">{userProfile.civicScore.toLocaleString()}</p>
                            <p className="text-sm text-white/70">{userProfile.rank}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Leaderboard List */}
            <div className="card overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
                        <p className="text-slate-400">Loading leaderboard...</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {entries.map((entry, index) => (
                            <div
                                key={entry.userId}
                                className={`flex items-center gap-4 p-4 transition-colors hover:bg-slate-50 ${entry.userId === userProfile?.uid ? 'bg-blue-50' : ''
                                    }`}
                            >
                                {/* Rank */}
                                <div className="w-10 text-center">
                                    {entry.rank <= 3 ? (
                                        <span className="text-2xl">{getRankIcon(entry.rank)}</span>
                                    ) : (
                                        <span className="text-lg font-bold text-slate-400">{entry.rank}</span>
                                    )}
                                </div>

                                {/* Avatar */}
                                {entry.userPhotoURL ? (
                                    <img
                                        src={entry.userPhotoURL}
                                        alt={entry.userName}
                                        className="w-10 h-10 rounded-full"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                                        {entry.userName[0]}
                                    </div>
                                )}

                                {/* Name & Badges */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-800 truncate flex items-center gap-2">
                                        {entry.userName}
                                        {entry.userId === userProfile?.uid && (
                                            <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">You</span>
                                        )}
                                    </p>
                                    <p className={`text-xs font-medium ${getRankColor(getRankFromScore(entry.civicScore))}`}>
                                        {getRankFromScore(entry.civicScore)} • {entry.badgeCount} badges
                                    </p>
                                </div>

                                {/* Score */}
                                <div className="text-right">
                                    <p className="font-bold text-slate-800">{entry.civicScore.toLocaleString()}</p>
                                    <p className="text-xs text-slate-400">{entry.reportsThisMonth} reports</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info Card */}
            <div className="card p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                    <span>💡</span> How to Earn Points
                </h4>
                <ul className="text-sm text-amber-700 space-y-1">
                    <li>📸 Report a civic issue: <strong>+50 pts</strong></li>
                    <li>✅ Your report gets resolved: <strong>+100 pts</strong></li>
                    <li>🔍 Verify another report: <strong>+25 pts</strong></li>
                    <li>🏅 Earn badges for milestones!</li>
                </ul>
            </div>
        </div>
    );
};

export default Leaderboard;
