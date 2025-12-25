// ============================================
// Interactive Civic Map Component
// ============================================

import React, { useEffect, useRef, useState } from 'react';
import { GrievanceReport, GrievanceCategory, GrievanceStatus, getCategoryIcon, getSeverityLabel, getJurisdictionLabel } from '../types';
import { BELAGAVI_CENTER, getBelagaviBoundaries } from '../services/geoService';

interface CivicMapProps {
    reports: GrievanceReport[];
}

const CivicMap: React.FC<CivicMapProps> = ({ reports }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [selectedReport, setSelectedReport] = useState<GrievanceReport | null>(null);
    const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

    // Filter reports
    const filteredReports = reports.filter(r => {
        if (filter === 'open') return [GrievanceStatus.SUBMITTED, GrievanceStatus.UNDER_REVIEW, GrievanceStatus.IN_PROGRESS].includes(r.status);
        if (filter === 'resolved') return r.status === GrievanceStatus.RESOLVED;
        return true;
    });

    // Get marker color based on severity
    const getMarkerColor = (severity: number): string => {
        if (severity >= 5) return '#ef4444'; // Red
        if (severity >= 4) return '#f97316'; // Orange
        if (severity >= 3) return '#eab308'; // Yellow
        if (severity >= 2) return '#22c55e'; // Green
        return '#3b82f6'; // Blue
    };

    // Calculate position on map (simple projection)
    const getPosition = (report: GrievanceReport) => {
        const lat = report.location?.latitude || BELAGAVI_CENTER.latitude;
        const lng = report.location?.longitude || BELAGAVI_CENTER.longitude;

        // Map bounds
        const bounds = {
            north: 15.92,
            south: 15.78,
            east: 74.56,
            west: 74.42,
        };

        const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * 100;
        const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * 100;

        return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
    };

    const boundaries = getBelagaviBoundaries();

    return (
        <div className="space-y-4">
            {/* Map Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🗺️</span>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Live Civic Heatmap</h3>
                        <p className="text-xs text-slate-400">{filteredReports.length} reports visible</p>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('open')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === 'open' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        Open
                    </button>
                    <button
                        onClick={() => setFilter('resolved')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === 'resolved' ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        Resolved
                    </button>
                </div>
            </div>

            {/* Map Container */}
            <div
                ref={mapRef}
                className="card relative h-[500px] overflow-hidden"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)',
                    backgroundSize: '20px 20px',
                }}
            >
                {/* Jurisdiction Boundaries (SVG Overlay) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* BCC Area - Blue */}
                    <path
                        d="M10,70 L90,70 L90,10 L10,10 Z"
                        fill="rgba(59, 130, 246, 0.1)"
                        stroke="rgba(59, 130, 246, 0.3)"
                        strokeWidth="0.5"
                    />

                    {/* Cantonment Area - Green */}
                    <path
                        d="M45,55 L70,55 L70,35 L45,35 Z"
                        fill="rgba(5, 150, 105, 0.15)"
                        stroke="rgba(5, 150, 105, 0.4)"
                        strokeWidth="0.5"
                    />

                    {/* VTU Campus - Purple */}
                    <path
                        d="M15,90 L35,90 L35,70 L15,70 Z"
                        fill="rgba(139, 92, 246, 0.15)"
                        stroke="rgba(139, 92, 246, 0.4)"
                        strokeWidth="0.5"
                    />
                </svg>

                {/* Jurisdiction Labels */}
                <div className="absolute top-4 left-4 text-[10px] font-bold text-blue-600/50 uppercase">
                    Belagavi City Corporation
                </div>
                <div className="absolute top-[40%] left-[50%] text-[10px] font-bold text-green-600/50 uppercase">
                    Cantonment
                </div>
                <div className="absolute bottom-[15%] left-[20%] text-[10px] font-bold text-purple-600/50 uppercase">
                    VTU Campus
                </div>

                {/* Report Markers */}
                {filteredReports.map((report) => {
                    const pos = getPosition(report);
                    const isSelected = selectedReport?.id === report.id;

                    return (
                        <div
                            key={report.id}
                            className="absolute cursor-pointer group z-10"
                            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                            onClick={() => setSelectedReport(isSelected ? null : report)}
                        >
                            {/* Marker */}
                            <div
                                className={`relative w-4 h-4 rounded-full border-2 border-white shadow-lg transition-transform ${isSelected ? 'scale-150 z-20' : 'hover:scale-125'
                                    }`}
                                style={{ backgroundColor: getMarkerColor(report.severity_score) }}
                            >
                                {/* Pulse effect for open reports */}
                                {report.status !== GrievanceStatus.RESOLVED && (
                                    <div
                                        className="absolute inset-0 rounded-full animate-ping opacity-50"
                                        style={{ backgroundColor: getMarkerColor(report.severity_score) }}
                                    />
                                )}
                            </div>

                            {/* Tooltip */}
                            <div
                                className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-30 transition-all duration-200 ${isSelected ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
                                    }`}
                            >
                                {report.imageUrl && (
                                    <img src={report.imageUrl} className="w-full h-24 object-cover" alt="Issue" />
                                )}
                                <div className="p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold">
                                            {getCategoryIcon(report.category)} {report.category.replace(/_/g, ' ')}
                                        </span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${report.status === GrievanceStatus.RESOLVED
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {report.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 line-clamp-2 mb-2">{report.description_summary}</p>
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                        <span>Severity: {report.severity_score}/5</span>
                                        <span>{getJurisdictionLabel(report.suggested_jurisdiction)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Empty State */}
                {filteredReports.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-slate-400">
                            <span className="text-4xl mb-4 block">📍</span>
                            <p className="font-medium">No reports to display</p>
                            <p className="text-sm">Be the first to report an issue!</p>
                        </div>
                    </div>
                )}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-sm">
                    <h5 className="text-[10px] font-bold uppercase text-slate-400 mb-2">Severity</h5>
                    <div className="space-y-1 text-[10px]">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500" /> Critical (5)
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High (4)
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> Medium (3)
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500" /> Low (1-2)
                        </div>
                    </div>
                </div>

                {/* Live Feed Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Live Feed
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
