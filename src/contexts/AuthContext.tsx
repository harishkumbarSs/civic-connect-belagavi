// ============================================
// Authentication Context
// ============================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRank } from '../types';

// Demo mode flag - set to true when Firebase isn't configured
const DEMO_MODE = !import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === 'your_firebase_api_key';

// Demo user for testing without Firebase
const DEMO_USER: UserProfile = {
    uid: 'demo-user-123',
    displayName: 'Demo Citizen',
    email: 'demo@civicconnect.in',
    photoURL: 'https://ui-avatars.com/api/?name=Demo+Citizen&background=3b82f6&color=fff',
    civicScore: 1250,
    totalReports: 14,
    resolvedReports: 8,
    verifiedReports: 5,
    rank: UserRank.GOLD,
    badges: [
        { id: 'first_report', name: 'First Step', description: 'Filed first report', icon: '🌟', earnedAt: Date.now() },
        { id: 'five_reports', name: 'Active Citizen', description: 'Filed 5 reports', icon: '🏅', earnedAt: Date.now() },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isAdmin: true,
};

interface AuthContextType {
    user: { uid: string; displayName: string | null; email: string | null; photoURL: string | null } | null;
    userProfile: UserProfile | null;
    loading: boolean;
    error: string | null;
    isDemoMode: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthContextType['user']>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (DEMO_MODE) {
            console.log('🎮 Running in DEMO MODE - Firebase not configured');
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        } else {
            initFirebaseAuth();
        }
    }, []);

    const initFirebaseAuth = async () => {
        try {
            const { auth } = await import('../lib/firebase');
            const { onAuthStateChanged } = await import('firebase/auth');

            onAuthStateChanged(auth, async (firebaseUser) => {
                if (firebaseUser) {
                    setUser({
                        uid: firebaseUser.uid,
                        displayName: firebaseUser.displayName,
                        email: firebaseUser.email,
                        photoURL: firebaseUser.photoURL,
                    });
                    setUserProfile({
                        uid: firebaseUser.uid,
                        displayName: firebaseUser.displayName || 'Citizen',
                        email: firebaseUser.email || undefined,
                        photoURL: firebaseUser.photoURL || undefined,
                        civicScore: 0,
                        totalReports: 0,
                        resolvedReports: 0,
                        verifiedReports: 0,
                        rank: UserRank.BRONZE,
                        badges: [],
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                    });
                } else {
                    setUser(null);
                    setUserProfile(null);
                }
                setLoading(false);
            });
        } catch (err: any) {
            console.error('Firebase init error:', err);
            setError('Firebase not configured. Running in demo mode.');
            setLoading(false);
        }
    };

    const signIn = async () => {
        setLoading(true);
        setError(null);

        if (DEMO_MODE) {
            await new Promise(resolve => setTimeout(resolve, 500));
            setUser({
                uid: DEMO_USER.uid,
                displayName: DEMO_USER.displayName,
                email: DEMO_USER.email || null,
                photoURL: DEMO_USER.photoURL || null,
            });
            setUserProfile(DEMO_USER);
            setLoading(false);
            return;
        }

        try {
            const { signInWithGoogle } = await import('../lib/firebase');
            await signInWithGoogle();
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        setLoading(true);

        if (DEMO_MODE) {
            setUser(null);
            setUserProfile(null);
            setLoading(false);
            return;
        }

        try {
            const { signOut: firebaseSignOut } = await import('../lib/firebase');
            await firebaseSignOut();
            setUserProfile(null);
        } catch (err: any) {
            setError(err.message || 'Failed to sign out');
        } finally {
            setLoading(false);
        }
    };

    const refreshProfile = async () => {
        if (DEMO_MODE && userProfile) {
            setUserProfile({
                ...userProfile,
                civicScore: userProfile.civicScore + 50,
                totalReports: userProfile.totalReports + 1,
            });
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            userProfile,
            loading,
            error,
            isDemoMode: DEMO_MODE,
            signIn,
            signOut,
            refreshProfile,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
