// ============================================
// Mock Grievance Reports for Demo Mode
// ============================================

import { GrievanceReport, GrievanceCategory, GrievanceStatus, Jurisdiction } from '../types';

// Sample images using placeholder services
const SAMPLE_IMAGES = {
    garbage: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400&h=300&fit=crop',
    pothole: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&h=300&fit=crop',
    streetlight: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    drainage: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400&h=300&fit=crop',
    water: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop',
    road: 'https://images.unsplash.com/photo-1515861461225-1488dfdaf0a8?w=400&h=300&fit=crop',
};

// Demo users
const DEMO_USERS = [
    { uid: 'demo-user-123', name: 'Demo Citizen', photo: 'https://ui-avatars.com/api/?name=Demo+Citizen&background=3b82f6&color=fff' },
    { uid: 'user-ravi-456', name: 'Ravi Kumar', photo: 'https://ui-avatars.com/api/?name=Ravi+Kumar&background=10b981&color=fff' },
    { uid: 'user-priya-789', name: 'Priya Sharma', photo: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=f59e0b&color=fff' },
    { uid: 'user-arun-101', name: 'Arun Patil', photo: 'https://ui-avatars.com/api/?name=Arun+Patil&background=8b5cf6&color=fff' },
    { uid: 'user-sneha-202', name: 'Sneha Desai', photo: 'https://ui-avatars.com/api/?name=Sneha+Desai&background=ec4899&color=fff' },
];

// Belagavi locations with realistic coordinates
const BELAGAVI_LOCATIONS = [
    { lat: 15.8497, lng: 74.4977, address: 'Shivaji Circle, Camp Area, Belagavi' },
    { lat: 15.8520, lng: 74.5050, address: 'Rani Channamma Circle, Camp, Belagavi' },
    { lat: 15.8650, lng: 74.4850, address: 'Tilakwadi Main Road, Belagavi' },
    { lat: 15.8400, lng: 74.5100, address: 'Shahapur, Near Bus Stand, Belagavi' },
    { lat: 15.7950, lng: 74.4700, address: 'VTU Campus, Machhe, Belagavi' },
    { lat: 15.8580, lng: 74.5020, address: 'Cantonment Railway Station, Belagavi' },
    { lat: 15.8450, lng: 74.4900, address: 'College Road, Belagavi' },
    { lat: 15.8700, lng: 74.4950, address: 'Angol, Belagavi' },
    { lat: 15.8550, lng: 74.4800, address: 'Sadashiv Nagar, Belagavi' },
    { lat: 15.8300, lng: 74.5200, address: 'Udyambag Industrial Area, Belagavi' },
    { lat: 15.8620, lng: 74.5080, address: 'Khade Bazaar, Camp, Belagavi' },
    { lat: 15.8380, lng: 74.4950, address: 'Hanuman Nagar, Belagavi' },
];

// Generate mock reports
export const MOCK_GRIEVANCE_REPORTS: GrievanceReport[] = [
    {
        id: 'demo-report-001',
        userId: DEMO_USERS[0].uid,
        userName: DEMO_USERS[0].name,
        userPhotoURL: DEMO_USERS[0].photo,
        category: GrievanceCategory.SOLID_WASTE,
        severity_score: 4,
        description_summary: 'Large garbage pile accumulating near Shivaji Circle for 3 days. Stray dogs and flies causing health hazard.',
        suggested_jurisdiction: Jurisdiction.BCC,
        detected_objects: ['garbage pile', 'plastic bags', 'organic waste', 'stray animals'],
        location: { latitude: 15.8497, longitude: 74.4977, address: 'Shivaji Circle, Camp Area, Belagavi' },
        imageUrl: SAMPLE_IMAGES.garbage,
        status: GrievanceStatus.IN_PROGRESS,
        civicPointsAwarded: 50,
        createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
        updatedAt: Date.now() - 12 * 60 * 60 * 1000, // 12 hours ago
    },
    {
        id: 'demo-report-002',
        userId: DEMO_USERS[1].uid,
        userName: DEMO_USERS[1].name,
        userPhotoURL: DEMO_USERS[1].photo,
        category: GrievanceCategory.ROADS,
        severity_score: 5,
        description_summary: 'Deep pothole on main road causing accidents. Multiple vehicles damaged. Immediate attention required.',
        suggested_jurisdiction: Jurisdiction.BCC,
        detected_objects: ['pothole', 'damaged road', 'water accumulation'],
        location: { latitude: 15.8650, longitude: 74.4850, address: 'Tilakwadi Main Road, Belagavi' },
        imageUrl: SAMPLE_IMAGES.pothole,
        status: GrievanceStatus.SUBMITTED,
        civicPointsAwarded: 50,
        createdAt: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
        updatedAt: Date.now() - 6 * 60 * 60 * 1000,
    },
    {
        id: 'demo-report-003',
        userId: DEMO_USERS[2].uid,
        userName: DEMO_USERS[2].name,
        userPhotoURL: DEMO_USERS[2].photo,
        category: GrievanceCategory.STREET_LIGHTS,
        severity_score: 3,
        description_summary: 'Street light not working for a week. Dark road causing safety concerns for pedestrians.',
        suggested_jurisdiction: Jurisdiction.CANTONMENT,
        detected_objects: ['broken lamp post', 'dark street'],
        location: { latitude: 15.8580, longitude: 74.5020, address: 'Cantonment Railway Station, Belagavi' },
        imageUrl: SAMPLE_IMAGES.streetlight,
        status: GrievanceStatus.UNDER_REVIEW,
        civicPointsAwarded: 50,
        createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
        updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    },
    {
        id: 'demo-report-004',
        userId: DEMO_USERS[3].uid,
        userName: DEMO_USERS[3].name,
        userPhotoURL: DEMO_USERS[3].photo,
        category: GrievanceCategory.DRAINAGE,
        severity_score: 4,
        description_summary: 'Clogged drain overflowing onto the road. Mosquito breeding ground. Foul smell in the area.',
        suggested_jurisdiction: Jurisdiction.BCC,
        detected_objects: ['clogged drain', 'stagnant water', 'debris'],
        location: { latitude: 15.8400, longitude: 74.5100, address: 'Shahapur, Near Bus Stand, Belagavi' },
        imageUrl: SAMPLE_IMAGES.drainage,
        status: GrievanceStatus.IN_PROGRESS,
        civicPointsAwarded: 50,
        createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
        updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    },
    {
        id: 'demo-report-005',
        userId: DEMO_USERS[4].uid,
        userName: DEMO_USERS[4].name,
        userPhotoURL: DEMO_USERS[4].photo,
        category: GrievanceCategory.WATER_SUPPLY,
        severity_score: 5,
        description_summary: 'Water pipeline burst causing water wastage and road damage. Urgent repair needed.',
        suggested_jurisdiction: Jurisdiction.VTU,
        detected_objects: ['burst pipe', 'water leakage', 'wet road'],
        location: { latitude: 15.7950, longitude: 74.4700, address: 'VTU Campus, Machhe, Belagavi' },
        imageUrl: SAMPLE_IMAGES.water,
        status: GrievanceStatus.SUBMITTED,
        civicPointsAwarded: 50,
        createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
        updatedAt: Date.now() - 2 * 60 * 60 * 1000,
    },
    {
        id: 'demo-report-006',
        userId: DEMO_USERS[0].uid,
        userName: DEMO_USERS[0].name,
        userPhotoURL: DEMO_USERS[0].photo,
        category: GrievanceCategory.SOLID_WASTE,
        severity_score: 3,
        description_summary: 'Garbage not collected for 2 days in residential area. Bins overflowing.',
        suggested_jurisdiction: Jurisdiction.BCC,
        detected_objects: ['overflowing bin', 'garbage'],
        location: { latitude: 15.8450, longitude: 74.4900, address: 'College Road, Belagavi' },
        imageUrl: SAMPLE_IMAGES.garbage,
        status: GrievanceStatus.RESOLVED,
        civicPointsAwarded: 100,
        resolution: {
            afterImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
            notes: 'Garbage collected and area cleaned by BCC sanitation team.',
            resolvedBy: 'BCC Ward Officer - Ramesh',
            resolvedAt: Date.now() - 12 * 60 * 60 * 1000,
        },
        createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
        updatedAt: Date.now() - 12 * 60 * 60 * 1000,
    },
    {
        id: 'demo-report-007',
        userId: DEMO_USERS[1].uid,
        userName: DEMO_USERS[1].name,
        userPhotoURL: DEMO_USERS[1].photo,
        category: GrievanceCategory.ROADS,
        severity_score: 2,
        description_summary: 'Minor crack developing on the road. May worsen during monsoon.',
        suggested_jurisdiction: Jurisdiction.PWD,
        detected_objects: ['road crack', 'worn surface'],
        location: { latitude: 15.8700, longitude: 74.4950, address: 'Angol, Belagavi' },
        imageUrl: SAMPLE_IMAGES.road,
        status: GrievanceStatus.RESOLVED,
        civicPointsAwarded: 100,
        resolution: {
            afterImageUrl: 'https://images.unsplash.com/photo-1515861461225-1488dfdaf0a8?w=400&h=300&fit=crop',
            notes: 'Road patching completed by PWD maintenance team.',
            resolvedBy: 'PWD Junior Engineer - Suresh',
            resolvedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
        },
        createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
        updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    },
    {
        id: 'demo-report-008',
        userId: DEMO_USERS[2].uid,
        userName: DEMO_USERS[2].name,
        userPhotoURL: DEMO_USERS[2].photo,
        category: GrievanceCategory.ENCROACHMENT,
        severity_score: 3,
        description_summary: 'Illegal street vendors blocking footpath. Pedestrians forced to walk on road.',
        suggested_jurisdiction: Jurisdiction.CANTONMENT,
        detected_objects: ['street vendor', 'blocked footpath', 'pedestrians on road'],
        location: { latitude: 15.8620, longitude: 74.5080, address: 'Khade Bazaar, Camp, Belagavi' },
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        status: GrievanceStatus.UNDER_REVIEW,
        civicPointsAwarded: 50,
        createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000, // 4 days ago
        updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
        id: 'demo-report-009',
        userId: DEMO_USERS[3].uid,
        userName: DEMO_USERS[3].name,
        userPhotoURL: DEMO_USERS[3].photo,
        category: GrievanceCategory.SANITATION,
        severity_score: 4,
        description_summary: 'Public toilet in unhygienic condition. No water supply and broken door.',
        suggested_jurisdiction: Jurisdiction.BCC,
        detected_objects: ['dirty toilet', 'broken door', 'no water'],
        location: { latitude: 15.8380, longitude: 74.4950, address: 'Hanuman Nagar, Belagavi' },
        imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
        status: GrievanceStatus.IN_PROGRESS,
        civicPointsAwarded: 50,
        createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
        updatedAt: Date.now() - 8 * 60 * 60 * 1000,
    },
    {
        id: 'demo-report-010',
        userId: DEMO_USERS[4].uid,
        userName: DEMO_USERS[4].name,
        userPhotoURL: DEMO_USERS[4].photo,
        category: GrievanceCategory.ELECTRICITY,
        severity_score: 5,
        description_summary: 'Exposed electric wires hanging dangerously low. High risk of electrocution during rain.',
        suggested_jurisdiction: Jurisdiction.CANTONMENT,
        detected_objects: ['exposed wires', 'broken pole', 'danger zone'],
        location: { latitude: 15.8520, longitude: 74.5050, address: 'Rani Channamma Circle, Camp, Belagavi' },
        imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop',
        status: GrievanceStatus.SUBMITTED,
        civicPointsAwarded: 50,
        createdAt: Date.now() - 30 * 60 * 1000, // 30 minutes ago
        updatedAt: Date.now() - 30 * 60 * 1000,
    },
    {
        id: 'demo-report-011',
        userId: DEMO_USERS[0].uid,
        userName: DEMO_USERS[0].name,
        userPhotoURL: DEMO_USERS[0].photo,
        category: GrievanceCategory.DRAINAGE,
        severity_score: 3,
        description_summary: 'Storm water drain partially blocked with construction debris.',
        suggested_jurisdiction: Jurisdiction.BCC,
        detected_objects: ['blocked drain', 'construction debris'],
        location: { latitude: 15.8550, longitude: 74.4800, address: 'Sadashiv Nagar, Belagavi' },
        imageUrl: SAMPLE_IMAGES.drainage,
        status: GrievanceStatus.RESOLVED,
        civicPointsAwarded: 100,
        resolution: {
            afterImageUrl: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400&h=300&fit=crop',
            notes: 'Drain cleared and debris removed. Fine issued to nearby construction site.',
            resolvedBy: 'BCC Drainage Dept - Mahesh',
            resolvedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
        },
        createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
        updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    },
    {
        id: 'demo-report-012',
        userId: DEMO_USERS[1].uid,
        userName: DEMO_USERS[1].name,
        userPhotoURL: DEMO_USERS[1].photo,
        category: GrievanceCategory.STREET_LIGHTS,
        severity_score: 2,
        description_summary: 'Street light flickering intermittently. May fail soon.',
        suggested_jurisdiction: Jurisdiction.BCC,
        detected_objects: ['flickering light', 'street lamp'],
        location: { latitude: 15.8300, longitude: 74.5200, address: 'Udyambag Industrial Area, Belagavi' },
        imageUrl: SAMPLE_IMAGES.streetlight,
        status: GrievanceStatus.RESOLVED,
        civicPointsAwarded: 100,
        resolution: {
            afterImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
            notes: 'Street light bulb replaced with new LED fixture.',
            resolvedBy: 'BCC Electrical Dept',
            resolvedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
        },
        createdAt: Date.now() - 6 * 24 * 60 * 60 * 1000, // 6 days ago
        updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    },
];

// Export demo leaderboard data
export const MOCK_LEADERBOARD = [
    { rank: 1, userId: 'user-top-1', userName: 'Vinay Gowda', userPhotoURL: 'https://ui-avatars.com/api/?name=Vinay+Gowda&background=fbbf24&color=000', civicScore: 3250, reportsThisMonth: 28, badgeCount: 6 },
    { rank: 2, userId: 'user-top-2', userName: 'Deepa Kulkarni', userPhotoURL: 'https://ui-avatars.com/api/?name=Deepa+Kulkarni&background=a78bfa&color=fff', civicScore: 2890, reportsThisMonth: 24, badgeCount: 5 },
    { rank: 3, userId: 'user-top-3', userName: 'Santosh Naik', userPhotoURL: 'https://ui-avatars.com/api/?name=Santosh+Naik&background=f87171&color=fff', civicScore: 2450, reportsThisMonth: 21, badgeCount: 5 },
    { rank: 4, userId: DEMO_USERS[0].uid, userName: DEMO_USERS[0].name, userPhotoURL: DEMO_USERS[0].photo, civicScore: 1250, reportsThisMonth: 14, badgeCount: 2 },
    { rank: 5, userId: DEMO_USERS[1].uid, userName: DEMO_USERS[1].name, userPhotoURL: DEMO_USERS[1].photo, civicScore: 1180, reportsThisMonth: 12, badgeCount: 3 },
    { rank: 6, userId: DEMO_USERS[2].uid, userName: DEMO_USERS[2].name, userPhotoURL: DEMO_USERS[2].photo, civicScore: 950, reportsThisMonth: 9, badgeCount: 2 },
    { rank: 7, userId: DEMO_USERS[3].uid, userName: DEMO_USERS[3].name, userPhotoURL: DEMO_USERS[3].photo, civicScore: 820, reportsThisMonth: 8, badgeCount: 2 },
    { rank: 8, userId: DEMO_USERS[4].uid, userName: DEMO_USERS[4].name, userPhotoURL: DEMO_USERS[4].photo, civicScore: 680, reportsThisMonth: 6, badgeCount: 1 },
    { rank: 9, userId: 'user-misc-1', userName: 'Kavitha Rao', userPhotoURL: 'https://ui-avatars.com/api/?name=Kavitha+Rao&background=34d399&color=fff', civicScore: 540, reportsThisMonth: 5, badgeCount: 1 },
    { rank: 10, userId: 'user-misc-2', userName: 'Prakash Joshi', userPhotoURL: 'https://ui-avatars.com/api/?name=Prakash+Joshi&background=60a5fa&color=fff', civicScore: 420, reportsThisMonth: 4, badgeCount: 1 },
];

export default MOCK_GRIEVANCE_REPORTS;
