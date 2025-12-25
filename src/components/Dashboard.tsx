// ============================================
// User Dashboard Component
// ============================================

import React from 'react';
import { UserProfile, UserRank, getScoreForNextRank, BADGES } from '../types';

interface DashboardProps {
    user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
    const nextRankScore = getScoreForNextRank(user.rank);
    const progress = nextRankScore === Infinity
        ? 100
        : Math.min((user.civicScore / nextRankScore) * 100, 100);

    const getRankColor = (rank: UserRank): string => {
        switch (rank) {
            case UserRank.CIVIC_GUARDIAN: return 'from-purple-500 to-pink-500';
            case UserRank.PLATINUM: return 'from-slate-600 to-slate-400';
            case UserRank.GOLD: return 'from-yellow-500 to-amber-400';
            case UserRank.SILVER: return 'from-slate-400 to-slate-300';
            default: return 'from-amber-700 to-amber-600';
        }
    };

    const getRankIcon = (rank: UserRank): string => {
        switch (rank) {
            case UserRank.CIVIC_GUARDIAN: return '👑';
            case UserRank.PLATINUM: return '💎';
            case UserRank.GOLD: return '🥇';
            case UserRank.SILVER: return '🥈';
            default: return '🥉';
        }
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Civic Score Card */}
            <div className={`col-span-2 bg-gradient-to-br ${getRankColor(user.rank)} rounded-2xl p-6 text-white shadow-lg relative overflow-hidden`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full border-8 border-white" />
                    <div className="absolute -right-20 -bottom-20 w-60 h-60 rounded-full border-8 border-white" />
                </div>

                <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Civic Score</p>
                            <h2 className="text-4xl font-bold">{user.civicScore.toLocaleString()}</h2>
                        </div>
                        <div className="text-4xl">{getRankIcon(user.rank)}</div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2">
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-white/80 text-xs">
                        <span className="font-semibold">{user.rank}</span>
                        {nextRankScore !== Infinity && (
                            <span>{nextRankScore - user.civicScore} pts to next rank</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Total Reports */}
            <div className="card p-5">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">📝</span>
                    <span className="badge-info">{user.rank}</span>
                </div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Reports Filed</p>
                <h3 className="text-2xl font-bold text-slate-800">{user.totalReports}</h3>
                {user.resolvedReports > 0 && (
                    <p className="text-green-500 text-xs font-medium mt-1">
                        ✓ {user.resolvedReports} resolved
                    </p>
                )}
            </div>

            {/* Badges */}
            <div className="card p-5">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">🏅</span>
                    {user.badges.length > 0 && (
                        <span className="text-xs text-slate-400">+{user.badges.length}</span>
                    )}
                </div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Badges Earned</p>
                <div className="flex gap-1 mt-2">
                    {user.badges.length > 0 ? (
                        user.badges.slice(0, 4).map((badge, idx) => (
                            <span key={idx} className="text-lg" title={badge.name}>{badge.icon}</span>
                        ))
                    ) : (
                        <p className="text-xs text-slate-400">File reports to earn badges!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
