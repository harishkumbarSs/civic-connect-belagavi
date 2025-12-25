// ============================================
// CivicConnect Belagavi - Type Definitions
// ============================================

import { Timestamp, GeoPoint } from 'firebase/firestore';

// ============================================
// Enums
// ============================================

export enum GrievanceCategory {
    SOLID_WASTE = 'SOLID_WASTE',
    ROADS = 'ROADS',
    WATER_SUPPLY = 'WATER_SUPPLY',
    DRAINAGE = 'DRAINAGE',
    ELECTRICITY = 'ELECTRICITY',
    STREET_LIGHTS = 'STREET_LIGHTS',
    ENCROACHMENT = 'ENCROACHMENT',
    SANITATION = 'SANITATION',
    OTHER = 'OTHER'
}

export enum Jurisdiction {
    BCC = 'BCC',           // Belagavi City Corporation
    CANTONMENT = 'CANTONMENT', // Belgaum Cantonment Board
    VTU = 'VTU',           // Visvesvaraya Technological University
    PWD = 'PWD',           // Public Works Department
    UNKNOWN = 'UNKNOWN'
}

export enum GrievanceStatus {
    SUBMITTED = 'SUBMITTED',
    UNDER_REVIEW = 'UNDER_REVIEW',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    REJECTED = 'REJECTED',
    REOPENED = 'REOPENED'
}

export enum UserRank {
    BRONZE = 'BRONZE',
    SILVER = 'SILVER',
    GOLD = 'GOLD',
    PLATINUM = 'PLATINUM',
    CIVIC_GUARDIAN = 'CIVIC_GUARDIAN'
}

// ============================================
// Badge System
// ============================================

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: number;
}

export const BADGES = {
    FIRST_REPORT: {
        id: 'first_report',
        name: 'First Step',
        description: 'Filed your first civic report',
        icon: '🌟'
    },
    FIVE_REPORTS: {
        id: 'five_reports',
        name: 'Active Citizen',
        description: 'Filed 5 civic reports',
        icon: '🏅'
    },
    TWENTY_REPORTS: {
        id: 'twenty_reports',
        name: 'Civic Champion',
        description: 'Filed 20 civic reports',
        icon: '🏆'
    },
    VERIFIED_RESOLVER: {
        id: 'verified_resolver',
        name: 'Verified Resolver',
        description: 'Had 3 reports verified as resolved',
        icon: '✅'
    },
    QUICK_RESPONDER: {
        id: 'quick_responder',
        name: 'Quick Responder',
        description: 'Reported an issue within 1 hour of occurrence',
        icon: '⚡'
    },
    MULTI_CATEGORY: {
        id: 'multi_category',
        name: 'All-Rounder',
        description: 'Reported issues in 5 different categories',
        icon: '🎯'
    },
    COMMUNITY_HERO: {
        id: 'community_hero',
        name: 'Community Hero',
        description: 'Helped verify 10 other reports',
        icon: '🦸'
    }
} as const;

// ============================================
// User Profile
// ============================================

export interface UserProfile {
    uid: string;
    displayName: string;
    email?: string;
    phoneNumber?: string;
    photoURL?: string;
    civicScore: number;
    totalReports: number;
    resolvedReports: number;
    verifiedReports: number;
    rank: UserRank;
    badges: Badge[];
    wardId?: string;
    createdAt: Timestamp | number;
    updatedAt: Timestamp | number;
    isAdmin?: boolean;
}

// ============================================
// Grievance Report
// ============================================

export interface GrievanceReport {
    id: string;

    // User info
    userId: string;
    userName: string;
    userPhotoURL?: string;

    // AI Analysis Results
    category: GrievanceCategory;
    severity_score: number; // 1-5
    description_summary: string;
    suggested_jurisdiction: Jurisdiction;
    detected_objects?: string[];
    detected_languages?: string[];

    // Location
    location: {
        latitude: number;
        longitude: number;
        address?: string;
    };
    wardId?: string;

    // Media
    imageUrl: string;
    audioUrl?: string;

    // Resolution
    status: GrievanceStatus;
    assignedTo?: string;
    assignedOfficerName?: string;
    resolution?: {
        afterImageUrl: string;
        notes: string;
        resolvedBy: string;
        resolvedAt: Timestamp | number;
    };

    // Gamification
    civicPointsAwarded: number;

    // Timestamps
    createdAt: Timestamp | number;
    updatedAt: Timestamp | number;
}

// ============================================
// Ward Data
// ============================================

export interface Ward {
    id: string;
    name: string;
    jurisdiction: Jurisdiction;
    boundary: GeoJSON.Polygon;
    activeGrievances: number;
    resolvedThisMonth: number;
    avgResolutionTime: number; // in hours
}

// ============================================
// Leaderboard Entry
// ============================================

export interface LeaderboardEntry {
    rank: number;
    userId: string;
    userName: string;
    userPhotoURL?: string;
    civicScore: number;
    reportsThisMonth: number;
    badgeCount: number;
}

export interface WardLeaderboard {
    wardId: string;
    wardName: string;
    totalReports: number;
    resolvedCount: number;
    resolutionRate: number;
    avgResolutionTime: number;
}

// ============================================
// Analytics
// ============================================

export interface AnalyticsSummary {
    totalReports: number;
    resolvedReports: number;
    pendingReports: number;
    avgResolutionTime: number;
    reportsByCategory: Record<GrievanceCategory, number>;
    reportsByJurisdiction: Record<Jurisdiction, number>;
    reportsBySeverity: Record<number, number>;
    topContributors: LeaderboardEntry[];
}

// ============================================
// API Response Types
// ============================================

export interface GeminiAnalysisResult {
    category: GrievanceCategory;
    severity_score: number;
    description_summary: string;
    suggested_jurisdiction: Jurisdiction;
    detected_objects?: string[];
}

// ============================================
// UI State Types
// ============================================

export type TabType = 'NEW' | 'HISTORY' | 'MAP' | 'LEADERBOARD';

export interface AppState {
    user: UserProfile | null;
    isLoading: boolean;
    error: string | null;
    activeTab: TabType;
}

// ============================================
// Utility Functions
// ============================================

export const getRankFromScore = (score: number): UserRank => {
    if (score >= 5000) return UserRank.CIVIC_GUARDIAN;
    if (score >= 2000) return UserRank.PLATINUM;
    if (score >= 1000) return UserRank.GOLD;
    if (score >= 500) return UserRank.SILVER;
    return UserRank.BRONZE;
};

export const getScoreForNextRank = (currentRank: UserRank): number => {
    switch (currentRank) {
        case UserRank.BRONZE: return 500;
        case UserRank.SILVER: return 1000;
        case UserRank.GOLD: return 2000;
        case UserRank.PLATINUM: return 5000;
        case UserRank.CIVIC_GUARDIAN: return Infinity;
        default: return 500;
    }
};

export const getSeverityLabel = (score: number): string => {
    if (score >= 5) return 'Critical';
    if (score >= 4) return 'High';
    if (score >= 3) return 'Medium';
    if (score >= 2) return 'Low';
    return 'Minor';
};

export const getSeverityColor = (score: number): string => {
    if (score >= 5) return 'text-red-600 bg-red-100';
    if (score >= 4) return 'text-orange-600 bg-orange-100';
    if (score >= 3) return 'text-amber-600 bg-amber-100';
    if (score >= 2) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
};

export const getCategoryIcon = (category: GrievanceCategory): string => {
    switch (category) {
        case GrievanceCategory.SOLID_WASTE: return '🗑️';
        case GrievanceCategory.ROADS: return '🛣️';
        case GrievanceCategory.WATER_SUPPLY: return '💧';
        case GrievanceCategory.DRAINAGE: return '🌊';
        case GrievanceCategory.ELECTRICITY: return '⚡';
        case GrievanceCategory.STREET_LIGHTS: return '💡';
        case GrievanceCategory.ENCROACHMENT: return '🚧';
        case GrievanceCategory.SANITATION: return '🧹';
        default: return '📋';
    }
};

export const getJurisdictionLabel = (jurisdiction: Jurisdiction): string => {
    switch (jurisdiction) {
        case Jurisdiction.BCC: return 'Belagavi City Corporation';
        case Jurisdiction.CANTONMENT: return 'Cantonment Board';
        case Jurisdiction.VTU: return 'VTU Campus';
        case Jurisdiction.PWD: return 'Public Works Dept.';
        default: return 'Unknown';
    }
};

export const getStatusColor = (status: GrievanceStatus): string => {
    switch (status) {
        case GrievanceStatus.SUBMITTED: return 'text-blue-600 bg-blue-100';
        case GrievanceStatus.UNDER_REVIEW: return 'text-purple-600 bg-purple-100';
        case GrievanceStatus.IN_PROGRESS: return 'text-amber-600 bg-amber-100';
        case GrievanceStatus.RESOLVED: return 'text-green-600 bg-green-100';
        case GrievanceStatus.REJECTED: return 'text-red-600 bg-red-100';
        case GrievanceStatus.REOPENED: return 'text-orange-600 bg-orange-100';
        default: return 'text-slate-600 bg-slate-100';
    }
};
