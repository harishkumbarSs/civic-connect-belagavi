// ============================================
// Premium Dashboard Component
// ============================================

import React from 'react';
import { UserProfile, UserRank, getScoreForNextRank } from '../types';

interface DashboardProps {
    user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
    const nextRankScore = getScoreForNextRank(user.rank);
    const progress = nextRankScore === Infinity
        ? 100
        : Math.min((user.civicScore / nextRankScore) * 100, 100);

    const getRankGradient = (rank: UserRank): string => {
        switch (rank) {
            case UserRank.CIVIC_GUARDIAN: return 'from-purple-600 via-pink-500 to-rose-500';
            case UserRank.PLATINUM: return 'from-slate-600 via-slate-500 to-slate-400';
            case UserRank.GOLD: return 'from-amber-500 via-yellow-500 to-amber-400';
            case UserRank.SILVER: return 'from-slate-400 via-slate-300 to-slate-200';
            default: return 'from-amber-700 via-amber-600 to-amber-500';
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

    const getRankLabel = (rank: UserRank): string => {
        switch (rank) {
            case UserRank.CIVIC_GUARDIAN: return 'Civic Guardian';
            case UserRank.PLATINUM: return 'Platinum';
            case UserRank.GOLD: return 'Gold';
            case UserRank.SILVER: return 'Silver';
            default: return 'Bronze';
        }
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Civic Score Card - Premium */}
            <div className={`col-span-2 bg-gradient-to-br ${getRankGradient(user.rank)} rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group`}>
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border-4 border-white/30 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full border-4 border-white/20 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute left-8 bottom-4 w-16 h-16 rounded-full border-2 border-white/20 group-hover:scale-125 transition-transform duration-500" />
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <div className="relative">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">
                                Civic Karma
                            </p>
                            <h2 className="text-5xl font-bold tracking-tight">
                                {user.civicScore.toLocaleString()}
                            </h2>
                        </div>
                        <div className="text-5xl float">{getRankIcon(user.rank)}</div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                            <div
                                className="h-full bg-white rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent shimmer" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-white/80 text-xs">
                        <span className="font-bold tracking-wide">{getRankLabel(user.rank)}</span>
                        {nextRankScore !== Infinity && (
                            <span className="bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                                {(nextRankScore - user.civicScore).toLocaleString()} pts to next rank
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Total Reports Card */}
            <div className="card p-5 stat-card hover:border-blue-200 transition-colors">
                <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <span className="text-xl">📝</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {user.resolvedReports > 0 && (
                            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                ✓ {user.resolvedReports}
                            </span>
                        )}
                    </div>
                </div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Reports Filed</p>
                <h3 className="text-3xl font-bold text-slate-800">{user.totalReports}</h3>
                <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span>{Math.round((user.resolvedReports / user.totalReports) * 100) || 0}% resolved</span>
                    </div>
                </div>
            </div>

            {/* Badges Card */}
            <div className="card p-5 stat-card hover:border-amber-200 transition-colors">
                <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                        <span className="text-xl">🏅</span>
                    </div>
                    {user.badges.length > 0 && (
                        <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                            +{user.badges.length}
                        </span>
                    )}
                </div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Badges Earned</p>
                <div className="flex items-center gap-1 mt-2">
                    {user.badges.length > 0 ? (
                        user.badges.slice(0, 5).map((badge, idx) => (
                            <div
                                key={idx}
                                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                                title={badge.name}
                            >
                                <span className="text-lg">{badge.icon}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-xs text-slate-400">
                            <p className="font-medium">No badges yet</p>
                            <p className="mt-0.5">File reports to earn!</p>
                        </div>
                    )}
                </div>
                {user.badges.length > 5 && (
                    <p className="text-xs text-slate-400 mt-2">+{user.badges.length - 5} more</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
