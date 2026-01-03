// ============================================
// Interactive Civic Map Component with Leaflet
// Real Map of Belagavi City
// ============================================

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GrievanceReport, GrievanceCategory, GrievanceStatus, getCategoryIcon, getSeverityLabel, getJurisdictionLabel } from '../types';
import { BELAGAVI_CENTER } from '../services/geoService';
import { formatDistanceToNow } from 'date-fns';

// Fix Leaflet default marker icon issue with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface CivicMapProps {
    reports: GrievanceReport[];
}

// Custom marker icons based on severity
const createCustomIcon = (severity: number, status: GrievanceStatus) => {
    const getColor = () => {
        if (status === GrievanceStatus.RESOLVED) return '#22c55e'; // Green for resolved
        if (severity >= 5) return '#ef4444'; // Red - Critical
        if (severity >= 4) return '#f97316'; // Orange - High
        if (severity >= 3) return '#eab308'; // Yellow - Medium
        if (severity >= 2) return '#22c55e'; // Green - Low
        return '#3b82f6'; // Blue - Minor
    };

    const color = getColor();
    const isResolved = status === GrievanceStatus.RESOLVED;

    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                width: 28px;
                height: 28px;
                background-color: ${color};
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                ${!isResolved ? 'animation: pulse 2s infinite;' : ''}
            ">
                ${isResolved ? '<span style="color: white; font-size: 14px;">✓</span>' : ''}
            </div>
            <style>
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 ${color}80; }
                    70% { box-shadow: 0 0 0 10px ${color}00; }
                    100% { box-shadow: 0 0 0 0 ${color}00; }
                }
            </style>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
    });
};

// Map bounds adjuster component
const MapBoundsAdjuster: React.FC<{ reports: GrievanceReport[] }> = ({ reports }) => {
    const map = useMap();

    useEffect(() => {
        if (reports.length > 0) {
            const bounds = L.latLngBounds(
                reports.map(r => [r.location?.latitude || BELAGAVI_CENTER.latitude, r.location?.longitude || BELAGAVI_CENTER.longitude])
            );
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }
    }, [reports, map]);

    return null;
};

const CivicMap: React.FC<CivicMapProps> = ({ reports }) => {
    const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');
    const [selectedCategory, setSelectedCategory] = useState<GrievanceCategory | 'all'>('all');

    // Filter reports
    const filteredReports = reports.filter(r => {
        const statusMatch = filter === 'all' ||
            (filter === 'open' && [GrievanceStatus.SUBMITTED, GrievanceStatus.UNDER_REVIEW, GrievanceStatus.IN_PROGRESS].includes(r.status)) ||
            (filter === 'resolved' && r.status === GrievanceStatus.RESOLVED);

        const categoryMatch = selectedCategory === 'all' || r.category === selectedCategory;

        return statusMatch && categoryMatch;
    });

    // Format timestamp
    const formatDate = (timestamp: any): string => {
        if (!timestamp) return 'Recently';
        const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp.toDate?.() || new Date(timestamp);
        return formatDistanceToNow(date, { addSuffix: true });
    };

    // Belagavi city center coordinates
    const belagaviCenter: [number, number] = [BELAGAVI_CENTER.latitude, BELAGAVI_CENTER.longitude];

    return (
        <div className="space-y-4">
            {/* Map Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🗺️</span>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Live Civic Heatmap - Belagavi</h3>
                        <p className="text-xs text-slate-400">{filteredReports.length} reports visible</p>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('open')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === 'open' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        Open
                    </button>
                    <button
                        onClick={() => setFilter('resolved')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === 'resolved' ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        Resolved
                    </button>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all ${selectedCategory === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                    All Categories
                </button>
                {Object.values(GrievanceCategory).filter(c => c !== GrievanceCategory.OTHER).map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        {getCategoryIcon(cat)} {cat.replace(/_/g, ' ')}
                    </button>
                ))}
            </div>

            {/* Leaflet Map Container */}
            <div className="card overflow-hidden rounded-2xl" style={{ height: '500px' }}>
                <MapContainer
                    center={belagaviCenter}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={true}
                    scrollWheelZoom={true}
                >
                    {/* OpenStreetMap Tiles */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Jurisdiction boundary circles (approximate) */}
                    <Circle
                        center={[15.8497, 74.4977]}
                        radius={3000}
                        pathOptions={{
                            color: '#3b82f6',
                            fillColor: '#3b82f6',
                            fillOpacity: 0.05,
                            weight: 1,
                            dashArray: '5, 5'
                        }}
                    />
                    <Circle
                        center={[15.8580, 74.5050]}
                        radius={1500}
                        pathOptions={{
                            color: '#059669',
                            fillColor: '#059669',
                            fillOpacity: 0.08,
                            weight: 2
                        }}
                    />
                    <Circle
                        center={[15.7950, 74.4700]}
                        radius={1000}
                        pathOptions={{
                            color: '#8b5cf6',
                            fillColor: '#8b5cf6',
                            fillOpacity: 0.08,
                            weight: 2
                        }}
                    />

                    {/* Adjust bounds to fit markers */}
                    {filteredReports.length > 0 && <MapBoundsAdjuster reports={filteredReports} />}

                    {/* Report Markers */}
                    {filteredReports.map((report) => (
                        <Marker
                            key={report.id}
                            position={[
                                report.location?.latitude || BELAGAVI_CENTER.latitude,
                                report.location?.longitude || BELAGAVI_CENTER.longitude
                            ]}
                            icon={createCustomIcon(report.severity_score, report.status)}
                        >
                            <Popup maxWidth={300} className="civic-popup">
                                <div className="min-w-[250px]">
                                    {report.imageUrl && (
                                        <img
                                            src={report.imageUrl}
                                            alt="Issue"
                                            className="w-full h-32 object-cover rounded-t-lg -mt-3 -mx-3 mb-3"
                                            style={{ width: 'calc(100% + 24px)' }}
                                        />
                                    )}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-slate-800">
                                                {getCategoryIcon(report.category)} {report.category.replace(/_/g, ' ')}
                                            </span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${report.status === GrievanceStatus.RESOLVED
                                                    ? 'bg-green-100 text-green-700'
                                                    : report.status === GrievanceStatus.IN_PROGRESS
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {report.status.replace(/_/g, ' ')}
                                            </span>
                                        </div>

                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            {report.description_summary}
                                        </p>

                                        <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                                            <span>⚠️ Severity: {report.severity_score}/5</span>
                                            <span>•</span>
                                            <span>🏛️ {getJurisdictionLabel(report.suggested_jurisdiction).split(' ')[0]}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                            <span>📍 {report.location?.address || 'Belagavi'}</span>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                            <div className="flex items-center gap-1.5">
                                                <img
                                                    src={report.userPhotoURL || `https://ui-avatars.com/api/?name=${report.userName}`}
                                                    alt={report.userName}
                                                    className="w-5 h-5 rounded-full"
                                                />
                                                <span className="text-[10px] text-slate-500">{report.userName}</span>
                                            </div>
                                            <span className="text-[10px] text-slate-400">
                                                {formatDate(report.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-between items-start">
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-sm" />
                        <span>Critical</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <div className="w-3 h-3 rounded-full bg-orange-500 border-2 border-white shadow-sm" />
                        <span>High</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 border-2 border-white shadow-sm" />
                        <span>Medium</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm" />
                        <span>Low/Resolved</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-dashed" />
                        <span>BCC Area</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-4 h-4 rounded-full border-2 border-green-500" />
                        <span>Cantonment</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-4 h-4 rounded-full border-2 border-purple-500" />
                        <span>VTU</span>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
                <div className="card p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{reports.length}</p>
                    <p className="text-xs text-slate-400">Total Reports</p>
                </div>
                <div className="card p-4 text-center">
                    <p className="text-2xl font-bold text-orange-500">
                        {reports.filter(r => r.status !== GrievanceStatus.RESOLVED).length}
                    </p>
                    <p className="text-xs text-slate-400">Open Issues</p>
                </div>
                <div className="card p-4 text-center">
                    <p className="text-2xl font-bold text-green-500">
                        {reports.filter(r => r.status === GrievanceStatus.RESOLVED).length}
                    </p>
                    <p className="text-xs text-slate-400">Resolved</p>
                </div>
            </div>
        </div>
    );
};

export default CivicMap;
