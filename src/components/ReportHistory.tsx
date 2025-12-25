// ============================================
// Report History Component
// ============================================

import React from 'react';
import { GrievanceReport, GrievanceStatus, GrievanceCategory, getCategoryIcon, getSeverityLabel, getSeverityColor, getStatusColor, getJurisdictionLabel } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface ReportHistoryProps {
    reports: GrievanceReport[];
}

const ReportHistory: React.FC<ReportHistoryProps> = ({ reports }) => {
    const formatDate = (timestamp: any): string => {
        try {
            const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp?.toDate?.();
            if (date) {
                return formatDistanceToNow(date, { addSuffix: true });
            }
            return 'Recently';
        } catch {
            return 'Recently';
        }
    };

    if (reports.length === 0) {
        return (
            <div className="card p-12 text-center">
                <span className="text-5xl mb-4 block">📋</span>
                <h3 className="text-lg font-bold text-slate-800 mb-2">No Reports Yet</h3>
                <p className="text-slate-400">
                    Start by reporting a civic issue to see your history here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">My Reports ({reports.length})</h3>
            </div>

            {reports.map((report) => (
                <div key={report.id} className="card overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Image */}
                        {report.imageUrl && (
                            <div className="w-full md:w-40 h-40 md:h-auto bg-slate-100 shrink-0">
                                <img
                                    src={report.imageUrl}
                                    alt="Issue"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 p-5">
                            {/* Header */}
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                                <div className="flex flex-wrap gap-2">
                                    {/* Category Badge */}
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                                        {getCategoryIcon(report.category)} {report.category.replace(/_/g, ' ')}
                                    </span>

                                    {/* Severity Badge */}
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getSeverityColor(report.severity_score)}`}>
                                        {getSeverityLabel(report.severity_score)}
                                    </span>
                                </div>

                                {/* Status Badge */}
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(report.status)}`}>
                                    {report.status.replace(/_/g, ' ')}
                                </span>
                            </div>

                            {/* Description */}
                            <h4 className="font-semibold text-slate-800 mb-2 line-clamp-2">
                                {report.description_summary}
                            </h4>

                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    {getJurisdictionLabel(report.suggested_jurisdiction)}
                                </div>

                                <div className="flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {formatDate(report.createdAt)}
                                </div>

                                <div className="flex items-center gap-1 text-blue-600 font-medium">
                                    <span>⭐</span>
                                    +{report.civicPointsAwarded} pts
                                </div>
                            </div>

                            {/* Resolution Info */}
                            {report.status === GrievanceStatus.RESOLVED && report.resolution && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-start gap-3">
                                        {report.resolution.afterImageUrl && (
                                            <img
                                                src={report.resolution.afterImageUrl}
                                                alt="Resolved"
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                        )}
                                        <div>
                                            <p className="text-xs font-semibold text-green-600 mb-1">✓ Issue Resolved</p>
                                            {report.resolution.notes && (
                                                <p className="text-xs text-slate-500">{report.resolution.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReportHistory;
