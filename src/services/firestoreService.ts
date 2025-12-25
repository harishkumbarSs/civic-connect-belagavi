// ============================================
// Firestore Service - CRUD Operations
// ============================================

import {
    db,
    collection,
    doc,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    getDocs,
    getDoc,
    serverTimestamp,
    Timestamp
} from '../lib/firebase';
import {
    GrievanceReport,
    GrievanceStatus,
    UserProfile,
    LeaderboardEntry,
    GrievanceCategory,
    Jurisdiction,
    UserRank,
    getRankFromScore
} from '../types';

// Collection references
const GRIEVANCES_COLLECTION = 'grievances';
const USERS_COLLECTION = 'users';

// ============================================
// Grievance Operations
// ============================================

export const createGrievance = async (
    grievanceData: Omit<GrievanceReport, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, GRIEVANCES_COLLECTION), {
            ...grievanceData,
            status: GrievanceStatus.SUBMITTED,
            civicPointsAwarded: 50, // Base points for filing
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error creating grievance:', error);
        throw error;
    }
};

export const updateGrievanceStatus = async (
    grievanceId: string,
    status: GrievanceStatus,
    resolution?: GrievanceReport['resolution']
): Promise<void> => {
    try {
        const updateData: any = {
            status,
            updatedAt: serverTimestamp()
        };

        if (resolution) {
            updateData.resolution = {
                ...resolution,
                resolvedAt: serverTimestamp()
            };
        }

        await updateDoc(doc(db, GRIEVANCES_COLLECTION, grievanceId), updateData);
    } catch (error) {
        console.error('Error updating grievance:', error);
        throw error;
    }
};

export const getGrievanceById = async (grievanceId: string): Promise<GrievanceReport | null> => {
    try {
        const docSnap = await getDoc(doc(db, GRIEVANCES_COLLECTION, grievanceId));
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as GrievanceReport;
        }
        return null;
    } catch (error) {
        console.error('Error fetching grievance:', error);
        throw error;
    }
};

export const getUserGrievances = async (userId: string): Promise<GrievanceReport[]> => {
    try {
        const q = query(
            collection(db, GRIEVANCES_COLLECTION),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as GrievanceReport[];
    } catch (error) {
        console.error('Error fetching user grievances:', error);
        throw error;
    }
};

export const getActiveGrievances = async (): Promise<GrievanceReport[]> => {
    try {
        const q = query(
            collection(db, GRIEVANCES_COLLECTION),
            where('status', 'in', [GrievanceStatus.SUBMITTED, GrievanceStatus.UNDER_REVIEW, GrievanceStatus.IN_PROGRESS]),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as GrievanceReport[];
    } catch (error) {
        console.error('Error fetching active grievances:', error);
        throw error;
    }
};

export const subscribeToGrievances = (
    callback: (grievances: GrievanceReport[]) => void,
    filterByStatus?: GrievanceStatus[]
): (() => void) => {
    let q = query(collection(db, GRIEVANCES_COLLECTION), orderBy('createdAt', 'desc'));

    if (filterByStatus && filterByStatus.length > 0) {
        q = query(
            collection(db, GRIEVANCES_COLLECTION),
            where('status', 'in', filterByStatus),
            orderBy('createdAt', 'desc')
        );
    }

    return onSnapshot(q, (snapshot) => {
        const grievances = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as GrievanceReport[];
        callback(grievances);
    });
};

export const getGrievancesByJurisdiction = async (
    jurisdiction: Jurisdiction
): Promise<GrievanceReport[]> => {
    try {
        const q = query(
            collection(db, GRIEVANCES_COLLECTION),
            where('suggested_jurisdiction', '==', jurisdiction),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as GrievanceReport[];
    } catch (error) {
        console.error('Error fetching grievances by jurisdiction:', error);
        throw error;
    }
};

// ============================================
// User Operations
// ============================================

export const createOrUpdateUser = async (userData: Partial<UserProfile>): Promise<void> => {
    try {
        if (!userData.uid) throw new Error('User ID is required');

        const userRef = doc(db, USERS_COLLECTION, userData.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            // Update existing user
            await updateDoc(userRef, {
                ...userData,
                updatedAt: serverTimestamp()
            });
        } else {
            // Create new user
            const newUser: Partial<UserProfile> = {
                ...userData,
                civicScore: 0,
                totalReports: 0,
                resolvedReports: 0,
                verifiedReports: 0,
                rank: UserRank.BRONZE,
                badges: [],
                createdAt: serverTimestamp() as any,
                updatedAt: serverTimestamp() as any
            };

            await updateDoc(userRef, newUser).catch(() => {
                // If update fails (doc doesn't exist), try setDoc
                return addDoc(collection(db, USERS_COLLECTION), { ...newUser, uid: userData.uid });
            });
        }
    } catch (error) {
        console.error('Error creating/updating user:', error);
        throw error;
    }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
        const userSnap = await getDoc(doc(db, USERS_COLLECTION, userId));
        if (userSnap.exists()) {
            return userSnap.data() as UserProfile;
        }
        return null;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const updateUserScore = async (
    userId: string,
    pointsToAdd: number,
    incrementReports: boolean = false
): Promise<void> => {
    try {
        const userRef = doc(db, USERS_COLLECTION, userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const currentData = userSnap.data() as UserProfile;
            const newScore = (currentData.civicScore || 0) + pointsToAdd;
            const newRank = getRankFromScore(newScore);

            const updateData: any = {
                civicScore: newScore,
                rank: newRank,
                updatedAt: serverTimestamp()
            };

            if (incrementReports) {
                updateData.totalReports = (currentData.totalReports || 0) + 1;
            }

            await updateDoc(userRef, updateData);
        }
    } catch (error) {
        console.error('Error updating user score:', error);
        throw error;
    }
};

// ============================================
// Leaderboard Operations
// ============================================

export const getLeaderboard = async (limit: number = 10): Promise<LeaderboardEntry[]> => {
    try {
        const q = query(
            collection(db, USERS_COLLECTION),
            orderBy('civicScore', 'desc')
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.slice(0, limit).map((doc, index) => {
            const data = doc.data() as UserProfile;
            return {
                rank: index + 1,
                userId: data.uid,
                userName: data.displayName,
                userPhotoURL: data.photoURL,
                civicScore: data.civicScore,
                reportsThisMonth: data.totalReports, // Simplified for now
                badgeCount: data.badges?.length || 0
            };
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
    }
};

// ============================================
// Analytics Operations
// ============================================

export const getGrievanceStats = async () => {
    try {
        const allGrievances = await getDocs(collection(db, GRIEVANCES_COLLECTION));

        let total = 0;
        let resolved = 0;
        let pending = 0;
        const byCategory: Record<string, number> = {};
        const byJurisdiction: Record<string, number> = {};
        const bySeverity: Record<number, number> = {};

        allGrievances.forEach(doc => {
            const data = doc.data() as GrievanceReport;
            total++;

            if (data.status === GrievanceStatus.RESOLVED) {
                resolved++;
            } else if (data.status !== GrievanceStatus.REJECTED) {
                pending++;
            }

            byCategory[data.category] = (byCategory[data.category] || 0) + 1;
            byJurisdiction[data.suggested_jurisdiction] = (byJurisdiction[data.suggested_jurisdiction] || 0) + 1;
            bySeverity[data.severity_score] = (bySeverity[data.severity_score] || 0) + 1;
        });

        return {
            totalReports: total,
            resolvedReports: resolved,
            pendingReports: pending,
            resolutionRate: total > 0 ? (resolved / total * 100).toFixed(1) : 0,
            reportsByCategory: byCategory,
            reportsByJurisdiction: byJurisdiction,
            reportsBySeverity: bySeverity
        };
    } catch (error) {
        console.error('Error fetching stats:', error);
        throw error;
    }
};
