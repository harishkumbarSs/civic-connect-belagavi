// ============================================
// New Report Form Component
// ============================================

import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { analyzeGrievance } from '../services/geminiService';
import { createGrievance, updateUserScore } from '../services/firestoreService';
import { uploadGrievanceImage, uploadVoiceNote, base64ToBlob } from '../services/storageService';
import { getCurrentLocation, getJurisdictionFromLocation, getAddressFromCoordinates } from '../services/geoService';
import { GrievanceReport, GrievanceStatus, GrievanceCategory, getCategoryIcon, getSeverityLabel, getSeverityColor, getJurisdictionLabel } from '../types';

interface NewReportFormProps {
    onSubmitSuccess: (report: GrievanceReport) => void;
}

const NewReportForm: React.FC<NewReportFormProps> = ({ onSubmitSuccess }) => {
    const { user, userProfile, refreshProfile } = useAuth();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [location, setLocation] = useState<{ latitude: number; longitude: number; address?: string } | null>(null);
    const [step, setStep] = useState<'capture' | 'review' | 'success'>('capture');
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);

    // Handle image upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setSelectedImage(reader.result as string);
            reader.readAsDataURL(file);

            // Also get location
            try {
                const loc = await getCurrentLocation();
                const address = await getAddressFromCoordinates(loc.latitude, loc.longitude);
                setLocation({ ...loc, address });
            } catch (err) {
                console.warn('Location unavailable:', err);
            }
        }
    };

    // Handle audio upload
    const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setSelectedAudio(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Analyze the grievance
    const handleAnalyze = async () => {
        if (!selectedImage) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            const imgBase64 = selectedImage.split(',')[1];
            const audioBase64 = selectedAudio ? selectedAudio.split(',')[1] : undefined;

            const analysis = await analyzeGrievance(imgBase64, audioBase64);
            setAnalysisResult(analysis);
            setStep('review');
        } catch (err: any) {
            setError(err.message || 'Failed to analyze image. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Submit the grievance
    const handleSubmit = async () => {
        if (!user || !analysisResult || !selectedImage) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            // Generate a temporary ID for storage paths
            const tempId = Date.now().toString();

            // Upload image to Firebase Storage
            const imageBlob = base64ToBlob(selectedImage.split(',')[1]);
            const imageUrl = await uploadGrievanceImage(imageBlob, tempId);

            // Upload audio if exists
            let audioUrl: string | undefined;
            if (selectedAudio) {
                const audioBlob = base64ToBlob(selectedAudio.split(',')[1], 'audio/mp3');
                audioUrl = await uploadVoiceNote(audioBlob, tempId);
            }

            // Get location and jurisdiction
            const loc = location || await getCurrentLocation();
            const { jurisdiction, wardId } = getJurisdictionFromLocation(loc.latitude, loc.longitude);

            // Create grievance in Firestore
            const grievanceData = {
                userId: user.uid,
                userName: user.displayName || 'Citizen',
                userPhotoURL: user.photoURL || undefined,
                category: analysisResult.category,
                severity_score: analysisResult.severity_score,
                description_summary: analysisResult.description_summary,
                suggested_jurisdiction: analysisResult.suggested_jurisdiction || jurisdiction,
                detected_objects: analysisResult.detected_objects,
                location: {
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                    address: loc.address,
                },
                wardId,
                imageUrl,
                audioUrl,
                status: GrievanceStatus.SUBMITTED,
                civicPointsAwarded: 50,
            };

            const grievanceId = await createGrievance(grievanceData as any);

            // Update user score
            await updateUserScore(user.uid, 50, true);
            await refreshProfile();

            setStep('success');

            // Call success callback after a delay
            setTimeout(() => {
                onSubmitSuccess({ id: grievanceId, ...grievanceData } as GrievanceReport);
                resetForm();
            }, 2000);
        } catch (err: any) {
            console.error('Submit error:', err);
            setError(err.message || 'Failed to submit grievance. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setSelectedImage(null);
        setSelectedAudio(null);
        setAnalysisResult(null);
        setLocation(null);
        setStep('capture');
        setError(null);
    };

    // Success Step
    if (step === 'success') {
        return (
            <div className="card p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Report Submitted! 🎉</h3>
                <p className="text-slate-500 mb-4">
                    You've earned <span className="text-blue-600 font-bold">+50 Civic Points</span>
                </p>
                <p className="text-sm text-slate-400">
                    Your report is now visible on the Live Map and has been routed to the appropriate authority.
                </p>
            </div>
        );
    }

    // Review Step
    if (step === 'review' && analysisResult) {
        return (
            <div className="card overflow-hidden">
                {/* Image Preview */}
                <div className="relative h-48 bg-slate-100">
                    <img src={selectedImage!} alt="Issue" className="w-full h-full object-cover" />
                    <button
                        onClick={() => setStep('capture')}
                        className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur rounded-lg text-slate-600 hover:bg-white"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">AI Analysis Result</h3>

                    {/* Analysis Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Category</p>
                            <p className="font-bold text-slate-800 flex items-center gap-2">
                                {getCategoryIcon(analysisResult.category)}
                                {analysisResult.category.replace(/_/g, ' ')}
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Severity</p>
                            <p className={`font-bold ${getSeverityColor(analysisResult.severity_score)} px-2 py-1 rounded-lg inline-block`}>
                                {analysisResult.severity_score}/5 - {getSeverityLabel(analysisResult.severity_score)}
                            </p>
                        </div>
                        <div className="col-span-2 bg-slate-50 rounded-xl p-4">
                            <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Jurisdiction</p>
                            <p className="font-bold text-slate-800">
                                {getJurisdictionLabel(analysisResult.suggested_jurisdiction)}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-blue-50 rounded-xl p-4 mb-6">
                        <p className="text-xs text-blue-600 uppercase font-semibold mb-1">AI Summary</p>
                        <p className="text-slate-700">{analysisResult.description_summary}</p>
                    </div>

                    {/* Location */}
                    {location && (
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{location.address || 'Belagavi, Karnataka'}</span>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setStep('capture')}
                            className="flex-1 btn-secondary"
                        >
                            Re-capture
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isAnalyzing}
                            className="flex-1 btn-primary"
                        >
                            {isAnalyzing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Submitting...
                                </span>
                            ) : 'Submit Report'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Capture Step (Default)
    return (
        <div className="card p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">📸</span>
                Report a Civic Issue
            </h3>

            <div className="space-y-6">
                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Evidence Photo <span className="text-red-500">*</span>
                    </label>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${selectedImage
                                ? 'border-blue-400 bg-blue-50'
                                : 'border-slate-200 hover:border-blue-400 bg-slate-50'
                            }`}
                    >
                        {selectedImage ? (
                            <div className="relative w-full h-full">
                                <img src={selectedImage} alt="Selected" className="h-full w-full object-cover rounded-xl" />
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <>
                                <svg className="w-12 h-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className="text-sm text-slate-500 font-medium">Click to capture or upload photo</p>
                                <p className="text-xs text-slate-400 mt-1">Take a clear photo of the issue</p>
                            </>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                    />
                </div>

                {/* Audio Upload */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Voice Note <span className="text-slate-400">(Optional - English/Kannada/Marathi)</span>
                    </label>
                    <div className="flex gap-3">
                        <button
                            onClick={() => audioInputRef.current?.click()}
                            className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium flex items-center justify-center gap-2 transition-all ${selectedAudio
                                    ? 'bg-green-50 border-green-200 text-green-700'
                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-300'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                            {selectedAudio ? '✓ Audio Added' : 'Add Voice Note'}
                        </button>
                        {selectedAudio && (
                            <button
                                onClick={() => setSelectedAudio(null)}
                                className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={audioInputRef}
                        onChange={handleAudioUpload}
                        accept="audio/*"
                        className="hidden"
                    />
                </div>

                {/* Location Info */}
                {location && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-3 rounded-xl">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Location captured: {location.address || 'Belagavi'}</span>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    onClick={handleAnalyze}
                    disabled={!selectedImage || isAnalyzing}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${!selectedImage || isAnalyzing
                            ? 'bg-slate-300 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
                        }`}
                >
                    {isAnalyzing ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            AI Analyzing...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <span>🤖</span>
                            Analyze with AI
                        </span>
                    )}
                </button>

                <p className="text-center text-xs text-slate-400">
                    Powered by Google Gemini AI • Your report earns you +50 Civic Points
                </p>
            </div>
        </div>
    );
};

export default NewReportForm;
