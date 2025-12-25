// ============================================
// Main App Component with Routing
// ============================================

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import NewReportForm from './components/NewReportForm';
import ReportHistory from './components/ReportHistory';
import CivicMap from './components/CivicMap';
import Leaderboard from './components/Leaderboard';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import { GrievanceReport, GrievanceStatus, TabType } from './types';
import { subscribeToGrievances } from './services/firestoreService';
import './index.css';

// Tab type for navigation
type AppTab = 'NEW' | 'MAP' | 'HISTORY' | 'LEADERBOARD' | 'ADMIN';

const AppContent: React.FC = () => {
    const { user, userProfile, loading } = useAuth();
    const [activeTab, setActiveTab] = useState<AppTab>('NEW');
    const [reports, setReports] = useState<GrievanceReport[]>([]);
    const [userReports, setUserReports] = useState<GrievanceReport[]>([]);

    // Subscribe to real-time grievance updates
    useEffect(() => {
        const unsubscribe = subscribeToGrievances((grievances) => {
            setReports(grievances);
            if (user) {
                setUserReports(grievances.filter(g => g.userId === user.uid));
            }
        });

        return () => unsubscribe();
    }, [user]);

    // Show loading screen
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 animate-pulse">
                        C
                    </div>
                    <p className="text-slate-500">Loading CivicConnect...</p>
                </div>
            </div>
        );
    }

    // Show login page if not authenticated
    if (!user) {
        return <LoginPage />;
    }

    // Handle successful report submission
    const handleReportSubmitted = (report: GrievanceReport) => {
        setActiveTab('MAP');
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <Header
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isAdmin={userProfile?.isAdmin}
            />

            <main className="max-w-6xl mx-auto px-4 pt-6">
                {/* User Dashboard Stats */}
                {userProfile && <Dashboard user={userProfile} />}

                {/* Tab Navigation */}
                <div className="flex border-b border-slate-200 mb-6 overflow-x-auto scrollbar-hide">
                    <TabButton
                        active={activeTab === 'NEW'}
                        onClick={() => setActiveTab('NEW')}
                        icon="📝"
                        label="Report"
                    />
                    <TabButton
                        active={activeTab === 'MAP'}
                        onClick={() => setActiveTab('MAP')}
                        icon="🗺️"
                        label="Live Map"
                    />
                    <TabButton
                        active={activeTab === 'HISTORY'}
                        onClick={() => setActiveTab('HISTORY')}
                        icon="📋"
                        label="My Reports"
                    />
                    <TabButton
                        active={activeTab === 'LEADERBOARD'}
                        onClick={() => setActiveTab('LEADERBOARD')}
                        icon="🏆"
                        label="Leaderboard"
                    />
                    {userProfile?.isAdmin && (
                        <TabButton
                            active={activeTab === 'ADMIN'}
                            onClick={() => setActiveTab('ADMIN')}
                            icon="⚙️"
                            label="Admin"
                        />
                    )}
                </div>

                {/* Tab Content */}
                <div className="animate-fade-in">
                    {activeTab === 'NEW' && (
                        <NewReportForm onSubmitSuccess={handleReportSubmitted} />
                    )}

                    {activeTab === 'MAP' && (
                        <CivicMap reports={reports} />
                    )}

                    {activeTab === 'HISTORY' && (
                        <ReportHistory reports={userReports} />
                    )}

                    {activeTab === 'LEADERBOARD' && (
                        <Leaderboard />
                    )}

                    {activeTab === 'ADMIN' && userProfile?.isAdmin && (
                        <AdminDashboard reports={reports} />
                    )}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 md:hidden z-50 safe-area-inset-bottom">
                <div className="flex justify-around items-center">
                    <MobileNavButton
                        active={activeTab === 'NEW'}
                        onClick={() => setActiveTab('NEW')}
                        icon="📝"
                        label="Report"
                    />
                    <MobileNavButton
                        active={activeTab === 'MAP'}
                        onClick={() => setActiveTab('MAP')}
                        icon="🗺️"
                        label="Map"
                    />
                    <MobileNavButton
                        active={activeTab === 'HISTORY'}
                        onClick={() => setActiveTab('HISTORY')}
                        icon="📋"
                        label="History"
                    />
                    <MobileNavButton
                        active={activeTab === 'LEADERBOARD'}
                        onClick={() => setActiveTab('LEADERBOARD')}
                        icon="🏆"
                        label="Ranks"
                    />
                </div>
            </nav>
        </div>
    );
};

// Tab Button Component
interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    icon: string;
    label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${active
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}
    >
        <span>{icon}</span>
        <span className="hidden sm:inline">{label}</span>
    </button>
);

// Mobile Nav Button
const MobileNavButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center gap-1 py-1 px-4 rounded-lg transition-all ${active ? 'text-blue-600' : 'text-slate-400'
            }`}
    >
        <span className="text-xl">{icon}</span>
        <span className="text-[10px] font-medium">{label}</span>
    </button>
);

// Main App with Providers
const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
