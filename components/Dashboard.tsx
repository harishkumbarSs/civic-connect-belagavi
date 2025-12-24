
import React from 'react';
import { UserProfile } from '../types';

interface DashboardProps {
  user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
        <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider mb-1">Civic Score</p>
        <h2 className="text-3xl font-bold">{user.civicScore}</h2>
        <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full" style={{ width: '65%' }}></div>
        </div>
        <p className="text-blue-100 text-[10px] mt-2">Next reward: Silver Citizen Badge</p>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Reports</p>
        <h2 className="text-3xl font-bold text-slate-800">{user.totalReports}</h2>
        <p className="text-green-500 text-xs font-medium mt-4">↑ 2 from last week</p>
      </div>
    </div>
  );
};

export default Dashboard;
