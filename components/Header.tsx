
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            C
          </div>
          <h1 className="text-xl font-bold text-slate-800">CivicConnect <span className="text-blue-600">Belagavi</span></h1>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex gap-4">
            <a href="#" className="text-sm font-medium text-blue-600">Report</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-800">My Reports</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-800">Leaderboard</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
