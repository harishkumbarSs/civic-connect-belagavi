// ============================================
// Admin Dashboard Component
// ============================================

import React, { useState } from 'react';
import { GrievanceReport, GrievanceStatus, GrievanceCategory, Jurisdiction, getCategoryIcon, getSeverityLabel, getSeverityColor, getStatusColor, getJurisdictionLabel } from '../types';
import { updateGrievanceStatus } from '../services/firestoreService';
import { formatDistanceToNow } from 'date-fns';

interface AdminDashboardProps {
    reports: GrievanceReport[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ reports }) => {
    const [selectedReport, setSelectedReport] = useState<GrievanceReport | null>(null);
    const [filterStatus, setFilterStatus] = useState<GrievanceStatus | 'ALL'>('ALL');
    const [filterJurisdiction, setFilterJurisdiction] = useState<Jurisdiction | 'ALL'>('ALL');
    const [isUpdating, setIsUpdating] = useState(false);

    // Filter reports
    const filteredReports = reports.filter(r => {
        if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
        if (filterJurisdiction !== 'ALL' && r.suggested_jurisdiction !== filterJurisdiction) return false;
        return true;
    });

    // Calculate stats
    const stats = {
        total: reports.length,
        pending: reports.filter(r => r.status === GrievanceStatus.SUBMITTED).length,
        inProgress: reports.filter(r => r.status === GrievanceStatus.IN_PROGRESS).length,
        resolved: reports.filter(r => r.status === GrievanceStatus.RESOLVED).length,
    };

    const formatDate = (timestamp: any): string => {
        try {
            const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp?.toDate?.();
            if (date) return formatDistanceToNow(date, { addSuffix: true });
            return 'Recently';
        } catch {
            return 'Recently';
        }
    };

    const handleStatusUpdate = async (reportId: string, newStatus: GrievanceStatus) => {
        setIsUpdating(true);
        try {
            await updateGrievanceStatus(reportId, newStatus);
            setSelectedReport(null);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2">
                <span className="text-2xl">⚙️</span>
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Admin Dashboard</h3>
                    <p className="text-xs text-slate-400">Manage civic grievances</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card p-4 text-center">
                    <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                    <p className="text-xs text-slate-400">Total Reports</p>
                </div>
                <div className="card p-4 text-center bg-amber-50 border-amber-200">
                    <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
                    <p className="text-xs text-amber-600">Pending</p>
                </div>
                <div className="card p-4 text-center bg-blue-50 border-blue-200">
                    <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
                    <p className="text-xs text-blue-600">In Progress</p>
                </div>
                <div className="card p-4 text-center bg-green-50 border-green-200">
                    <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
                    <p className="text-xs text-green-600">Resolved</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="input-field w-auto"
                >
                    <option value="ALL">All Statuses</option>
                    {Object.values(GrievanceStatus).map(status => (
                        <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                    ))}
                </select>

                <select
                    value={filterJurisdiction}
                    onChange={(e) => setFilterJurisdiction(e.target.value as any)}
                    className="input-field w-auto"
                >
                    <option value="ALL">All Jurisdictions</option>
                    {Object.values(Jurisdiction).map(j => (
                        <option key={j} value={j}>{getJurisdictionLabel(j)}</option>
                    ))}
                </select>
            </div>

            {/* Reports Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Issue</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Category</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Severity</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Jurisdiction</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Time</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredReports.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                                        No reports match the selected filters
                                    </td>
                                </tr>
                            ) : (
                                filteredReports.map((report) => (
                                    <tr key={report.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {report.imageUrl && (
                                                    <img src={report.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                                )}
                                                <div className="max-w-[200px]">
                                                    <p className="text-sm font-medium text-slate-800 truncate">
                                                        {report.description_summary}
                                                    </p>
                                                    <p className="text-xs text-slate-400 truncate">
                                                        by {report.userName}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm">
                                                {getCategoryIcon(report.category)} {report.category.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(report.severity_score)}`}>
                                                {report.severity_score}/5
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">
                                            {getJurisdictionLabel(report.suggested_jurisdiction)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-400">
                                            {formatDate(report.createdAt)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => setSelectedReport(report)}
                                                className="btn-secondary text-xs py-1 px-3"
                                            >
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedReport && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        {/* Image */}
                        {selectedReport.imageUrl && (
                            <img src={selectedReport.imageUrl} alt="Issue" className="w-full h-48 object-cover" />
                        )}

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="text-lg font-bold text-slate-800">Grievance Details</h4>
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    className="p-2 hover:bg-slate-100 rounded-lg"
                                >
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                <p className="text-slate-600">{selectedReport.description_summary}</p>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-slate-400">Category</p>
                                        <p className="font-medium">{getCategoryIcon(selectedReport.category)} {selectedReport.category}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400">Severity</p>
                                        <p className="font-medium">{getSeverityLabel(selectedReport.severity_score)} ({selectedReport.severity_score}/5)</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400">Jurisdiction</p>
                                        <p className="font-medium">{getJurisdictionLabel(selectedReport.suggested_jurisdiction)}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400">Reported By</p>
                                        <p className="font-medium">{selectedReport.userName}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Update Buttons */}
                            <div className="border-t border-slate-200 pt-4">
                                <p className="text-sm font-medium text-slate-700 mb-3">Update Status:</p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { status: GrievanceStatus.UNDER_REVIEW, color: 'bg-purple-600', label: 'Under Review' },
                                        { status: GrievanceStatus.IN_PROGRESS, color: 'bg-blue-600', label: 'In Progress' },
                                        { status: GrievanceStatus.RESOLVED, color: 'bg-green-600', label: 'Resolved' },
                                        { status: GrievanceStatus.REJECTED, color: 'bg-red-600', label: 'Reject' },
                                    ].map(({ status, color, label }) => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusUpdate(selectedReport.id, status)}
                                            disabled={isUpdating || selectedReport.status === status}
                                            className={`px-4 py-2 ${color} text-white text-sm font-medium rounded-lg 
                        disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
