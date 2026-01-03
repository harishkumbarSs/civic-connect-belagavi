// ============================================
// Geolocation Service
// ============================================

import { Jurisdiction } from '../types';
import belagaviBoundaries from '../data/belagavi-boundaries.json';

// Demo mode - set to false to use real device location
const DEMO_MODE = false;

// ============================================
// Get Current Location
// ============================================

export interface GeoLocation {
    latitude: number;
    longitude: number;
    accuracy?: number;
    address?: string;
}

// Random Belagavi locations for demo variety
const BELAGAVI_DEMO_LOCATIONS = [
    { lat: 15.8497, lng: 74.4977, address: 'Shivaji Circle, Belagavi, Karnataka, 590001, India' },
    { lat: 15.8520, lng: 74.5050, address: 'Camp Area, Belagavi, Karnataka, 590001, India' },
    { lat: 15.8650, lng: 74.4850, address: 'Tilakwadi, Belagavi, Karnataka, 590006, India' },
    { lat: 15.8400, lng: 74.5100, address: 'Shahapur, Belagavi, Karnataka, 590003, India' },
    { lat: 15.7950, lng: 74.4700, address: 'VTU Campus, Machhe, Belagavi, Karnataka, 590018, India' },
];

export const getCurrentLocation = (): Promise<GeoLocation> => {
    return new Promise((resolve, reject) => {
        // For demo/hackathon, always use fixed Belagavi location
        if (DEMO_MODE) {
            console.log('🎮 Demo mode: Using Belagavi location');
            resolve({
                latitude: 15.8497,
                longitude: 74.4977,
                accuracy: 10,
                address: 'Shivaji Circle, Camp Area, Belagavi, Karnataka, 590001, India',
            });
            return;
        }

        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                });
            },
            (error) => {
                // Fallback to Belagavi city center for demo
                console.warn('Geolocation error, using default:', error);
                resolve({
                    latitude: 15.8497,
                    longitude: 74.4977,
                    accuracy: 1000,
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
            }
        );
    });
};

// ============================================
// Point in Polygon Check (Ray Casting)
// ============================================

const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
    const [x, y] = point;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];

        if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
            inside = !inside;
        }
    }

    return inside;
};

// ============================================
// Determine Jurisdiction from Coordinates
// ============================================

export const getJurisdictionFromLocation = (
    latitude: number,
    longitude: number
): { jurisdiction: Jurisdiction; wardId?: string; areaName?: string } => {
    const point: [number, number] = [longitude, latitude]; // GeoJSON uses [lng, lat]

    // Check each feature for point containment
    for (const feature of belagaviBoundaries.features) {
        const coords = feature.geometry.coordinates[0] as number[][];

        if (pointInPolygon(point, coords)) {
            return {
                jurisdiction: feature.properties.jurisdiction as Jurisdiction,
                wardId: feature.properties.wardId,
                areaName: feature.properties.name,
            };
        }
    }

    // Default to BCC if not in any specific polygon
    return {
        jurisdiction: Jurisdiction.BCC,
        areaName: 'Belagavi City',
    };
};

// ============================================
// Reverse Geocoding (using Nominatim - free)
// ============================================

export const getAddressFromCoordinates = async (
    latitude: number,
    longitude: number
): Promise<string> => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'CivicConnect-Belagavi/1.0',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Geocoding failed');
        }

        const data = await response.json();
        return data.display_name || 'Belagavi, Karnataka';
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return 'Belagavi, Karnataka, India';
    }
};

// ============================================
// Get GeoJSON Layer Data
// ============================================

export const getBelagaviBoundaries = () => belagaviBoundaries;

// ============================================
// Calculate Distance Between Points (Haversine)
// ============================================

export const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

const toRad = (deg: number): number => deg * (Math.PI / 180);

// ============================================
// Default Belagavi Center
// ============================================

export const BELAGAVI_CENTER = {
    latitude: 15.8497,
    longitude: 74.4977,
};

export const BELAGAVI_BOUNDS = {
    north: 15.92,
    south: 15.78,
    east: 74.56,
    west: 74.42,
};
