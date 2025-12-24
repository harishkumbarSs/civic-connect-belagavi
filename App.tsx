
import React, { useState, useRef } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CivicMap from './components/CivicMap';
import { analyzeGrievance } from './services/geminiService';
import { GrievanceReport, GrievanceCategory, UserProfile } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile>({
    name: "Basavaraj",
    civicScore: 1250,
    totalReports: 14,
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
  const [reports, setReports] = useState<GrievanceReport[]>([]);
  const [activeTab, setActiveTab] = useState<'NEW' | 'HISTORY' | 'MAP'>('NEW');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedAudio(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const submitGrievance = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const imgBase64 = selectedImage.split(',')[1];
      const audioBase64 = selectedAudio ? selectedAudio.split(',')[1] : undefined;

      const analysis = await analyzeGrievance(imgBase64, audioBase64);

      const newReport: GrievanceReport = {
        id: Math.random().toString(36).substr(2, 9),
        ...analysis,
        timestamp: Date.now(),
        imageUrl: selectedImage,
        status: 'OPEN', // Mark as open for the heatmap
      };

      setReports([newReport, ...reports]);
      setUser(prev => ({
        ...prev,
        civicScore: prev.civicScore + 50,
        totalReports: prev.totalReports + 1
      }));
      
      setSelectedImage(null);
      setSelectedAudio(null);
      setActiveTab('MAP');
      alert("Grievance filed successfully! It is now visible on the heatmap.");
    } catch (error) {
      console.error(error);
      alert("Failed to analyze. Please try a clearer photo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 pt-8">
        <Dashboard user={user} />

        <div className="flex border-b border-slate-200 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button 
            onClick={() => setActiveTab('NEW')}
            className={`px-6 py-3 text-sm font-semibold transition-colors ${activeTab === 'NEW' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}
          >
            New Report
          </button>
          <button 
            onClick={() => setActiveTab('MAP')}
            className={`px-6 py-3 text-sm font-semibold transition-colors ${activeTab === 'MAP' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}
          >
            Live Map
          </button>
          <button 
            onClick={() => setActiveTab('HISTORY')}
            className={`px-6 py-3 text-sm font-semibold transition-colors ${activeTab === 'HISTORY' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}
          >
            My History
          </button>
        </div>

        {activeTab === 'MAP' && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Civic Heatmap
            </h3>
            <CivicMap reports={reports} />
          </div>
        )}

        {activeTab === 'NEW' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Report an Issue</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Evidence Image (Required)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${selectedImage ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-400 bg-slate-50'}`}
                >
                  {selectedImage ? (
                    <img src={selectedImage} alt="Selected" className="h-full w-full object-cover rounded-xl" />
                  ) : (
                    <>
                      <svg className="w-10 h-10 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-slate-500 font-medium">Click to upload photo of the issue</p>
                    </>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Voice Note (Optional - English/Kannada/Marathi)</label>
                <div className="flex gap-4 items-center">
                  <button 
                    onClick={() => audioInputRef.current?.click()}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium flex items-center justify-center gap-2 transition-all ${selectedAudio ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    {selectedAudio ? 'Audio Recorded' : 'Record or Upload Voice Note'}
                  </button>
                  {selectedAudio && (
                    <button onClick={() => setSelectedAudio(null)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
                <input type="file" ref={audioInputRef} onChange={handleAudioUpload} accept="audio/*" className="hidden" />
              </div>

              <button 
                onClick={submitGrievance}
                disabled={!selectedImage || isAnalyzing}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${!selectedImage || isAnalyzing ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'}`}
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    AI Analyzing Situation...
                  </div>
                ) : 'Submit Grievance'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'HISTORY' && (
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <p className="text-slate-400">No reports filed yet. Start by reporting an issue!</p>
              </div>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm overflow-hidden flex flex-col md:flex-row gap-5">
                  <div className="w-full md:w-32 h-32 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                    <img src={report.imageUrl} alt="Grievance" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        report.category === GrievanceCategory.SOLID_WASTE ? 'bg-emerald-100 text-emerald-700' :
                        report.category === GrievanceCategory.ROADS ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {report.category.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400">{new Date(report.timestamp).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 leading-tight mb-2 line-clamp-2">{report.description_summary}</h4>
                    <div className="flex flex-wrap gap-3 text-xs">
                      <div className="flex items-center gap-1 text-slate-500">
                        <span className="font-semibold text-slate-700">Jurisdiction:</span> {report.suggested_jurisdiction}
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <span className="font-semibold text-slate-700">Severity:</span> {report.severity_score}/5
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <span className="font-semibold text-slate-700">Status:</span> 
                        <span className="text-blue-600 font-bold">{report.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 md:hidden flex justify-between items-center z-50">
        <button className={`flex flex-col items-center gap-1 ${activeTab === 'NEW' ? 'text-blue-600' : 'text-slate-400'}`} onClick={() => setActiveTab('NEW')}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg>
          <span className="text-[10px] font-bold">Report</span>
        </button>
        <button className={`flex flex-col items-center gap-1 ${activeTab === 'MAP' ? 'text-blue-600' : 'text-slate-400'}`} onClick={() => setActiveTab('MAP')}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span className="text-[10px] font-bold">Map</span>
        </button>
        <button className={`flex flex-col items-center gap-1 ${activeTab === 'HISTORY' ? 'text-blue-600' : 'text-slate-400'}`} onClick={() => setActiveTab('HISTORY')}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          <span className="text-[10px] font-medium">History</span>
        </button>
      </div>
    </div>
  );
};

export default App;
