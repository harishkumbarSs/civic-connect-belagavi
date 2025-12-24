
import React from 'react';
import { GrievanceReport, GrievanceCategory } from '../types';

interface CivicMapProps {
  reports: GrievanceReport[];
}

const CivicMap: React.FC<CivicMapProps> = ({ reports }) => {
  // Filter for open grievances
  const openReports = reports.filter(r => r.status === 'OPEN' || r.status === 'SUBMITTED');

  const getMarkerColor = (severity: number) => {
    if (severity >= 5) return '#ef4444'; // Red
    if (severity >= 3) return '#f97316'; // Orange
    return '#eab308'; // Yellow
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[500px] relative">
      {/* Mock Map Background */}
      <div className="absolute inset-0 bg-slate-100 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]">
        
        {/* Belagavi Cantonment Polygon (Simulated) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300">
          <polygon 
            points="100,100 250,80 300,180 200,240 80,200" 
            fill="rgba(37, 99, 235, 0.15)" 
            stroke="rgba(37, 99, 235, 0.4)" 
            strokeWidth="2"
          />
          <text x="120" y="150" className="text-[10px] fill-blue-600 font-bold opacity-50">CANTONMENT BOARD AREA</text>
        </svg>

        {/* Dynamic Markers */}
        {openReports.map((report, idx) => {
          // Simple deterministic jitter for layout
          const x = 50 + (parseInt(report.id, 36) % 300);
          const y = 50 + (parseInt(report.id.slice(2), 36) % 200);
          
          return (
            <div 
              key={report.id}
              className="absolute group cursor-pointer"
              style={{ left: `${x}px`, top: `${y}px` }}
            >
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-md transform hover:scale-125 transition-transform"
                style={{ backgroundColor: getMarkerColor(report.severity_score) }}
              />
              
              {/* Tooltip / InfoWindow Simulation */}
              <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-10">
                {report.imageUrl && (
                  <img src={report.imageUrl} className="w-full h-20 object-cover rounded-lg mb-2" alt="Evidence" />
                )}
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{report.category}</p>
                <p className="text-xs font-semibold text-slate-800 line-clamp-2">{report.description_summary}</p>
                <p className="text-[10px] mt-1 text-slate-400">Severity: {report.severity_score}/5</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-sm text-[10px]">
        <h5 className="font-bold mb-2 uppercase text-slate-500">Severity Legend</h5>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" /> <span>High (4-5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500" /> <span>Medium (3)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500" /> <span>Low (1-2)</span>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg">
        Live Feed: Belagavi
      </div>
    </div>
  );
};

export default CivicMap;
