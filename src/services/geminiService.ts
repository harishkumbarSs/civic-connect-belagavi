// ============================================
// Enhanced Gemini AI Service
// Multimodal Analysis for Civic Grievances
// ============================================

import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { GrievanceCategory, Jurisdiction, GeminiAnalysisResult } from "../types";

// Initialize Gemini AI
const getAI = () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    if (!apiKey) {
        console.warn('Gemini API key not configured. AI features will be limited.');
    }
    return new GoogleGenAI({ apiKey });
};

// ============================================
// Function Declaration for Structured Output
// ============================================

const fileGrievanceTool: FunctionDeclaration = {
    name: 'file_grievance',
    description: 'Structure a civic grievance report based on visual and audio evidence from Belagavi city.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            category: {
                type: Type.STRING,
                enum: Object.values(GrievanceCategory),
                description: 'The type of civic issue observed. Choose the most appropriate category.',
            },
            severity_score: {
                type: Type.INTEGER,
                description: 'Severity level from 1 (minor inconvenience) to 5 (critical emergency/health hazard).',
            },
            description_summary: {
                type: Type.STRING,
                description: 'A concise, factual summary of the issue in English (2-3 sentences).',
            },
            suggested_jurisdiction: {
                type: Type.STRING,
                enum: Object.values(Jurisdiction),
                description: `The administrative body responsible. 
          BCC: Belagavi City Corporation (default for city areas)
          CANTONMENT: Belgaum Cantonment Board (military/civil areas near Camp)
          VTU: Visvesvaraya Technological University campus
          PWD: Public Works Department (state highways)`,
            },
            detected_objects: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of key objects detected in the image (e.g., garbage pile, pothole, broken pipe)',
            }
        },
        required: ['category', 'severity_score', 'description_summary', 'suggested_jurisdiction'],
    },
};

// ============================================
// System Prompt
// ============================================

const SYSTEM_PROMPT = `You are CivicConnect AI, an intelligent civic issue classifier for Belagavi (Belgaum), Karnataka, India.

Your role is to analyze images and audio of civic problems and generate structured reports for the municipal authorities.

## Context about Belagavi:
- Population: ~500,000 in the city, ~700,000 in metro area
- Administrative divisions: Belagavi City Corporation (BCC), Cantonment Board, VTU Campus
- Common issues: Solid waste management, road conditions, drainage, water supply
- Languages spoken: Kannada, Marathi, Hindi, English

## Analysis Guidelines:
1. **Category Selection**: Choose the most specific category that fits the issue
2. **Severity Scoring**:
   - 1: Minor cosmetic issue (small litter, faded markings)
   - 2: Low priority (small potholes, minor water seepage)
   - 3: Medium priority (larger potholes, overflowing bins)
   - 4: High priority (road damage, significant flooding)
   - 5: Critical/Emergency (health hazards, dangerous conditions, blocked emergency access)

3. **Jurisdiction Logic**:
   - Default to BCC for most city areas
   - Use CANTONMENT if you see military facilities, specific Cantonment landmarks, or "Cantonment" signage
   - Use VTU only for issues clearly within the university campus
   - Use PWD for state highways and major roads

4. **Description**: Be factual and specific. Include location hints if visible in the image.

Always call the file_grievance function with your analysis.`;

// ============================================
// Main Analysis Function
// ============================================

export const analyzeGrievance = async (
    imageBase64: string,
    audioBase64?: string
): Promise<GeminiAnalysisResult> => {
    const ai = getAI();

    // Build content parts
    const parts: any[] = [
        {
            inlineData: {
                mimeType: 'image/jpeg',
                data: imageBase64,
            },
        },
        {
            text: `Analyze this image from Belagavi city. Identify the civic problem and provide a structured report.
      
Consider:
- What type of issue is this (waste, roads, water, etc.)?
- How severe is it on a scale of 1-5?
- Which authority should handle this (BCC, Cantonment, VTU, PWD)?

Return the structured data via the file_grievance function.`,
        },
    ];

    // Add audio if provided
    if (audioBase64) {
        parts.push({
            inlineData: {
                mimeType: 'audio/mp3',
                data: audioBase64,
            },
        });
        parts.push({
            text: 'The citizen has also provided a voice note describing the issue. Consider this additional context in your analysis.',
        });
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: { parts },
            config: {
                systemInstruction: SYSTEM_PROMPT,
                tools: [{ functionDeclarations: [fileGrievanceTool] }],
                toolConfig: {
                    functionCallingConfig: {
                        mode: 'ANY',
                        allowedFunctionNames: ['file_grievance']
                    }
                }
            },
        });

        const call = response.functionCalls?.[0];
        if (call && call.args) {
            return call.args as GeminiAnalysisResult;
        }

        throw new Error("AI failed to generate a structured report. Please try with a clearer image.");
    } catch (error: any) {
        console.error("Gemini Analysis Error:", error);

        // Provide fallback for demo/testing without API key
        if (error.message?.includes('API key') || error.message?.includes('401')) {
            console.warn('Using mock analysis for demo mode');
            return generateMockAnalysis();
        }

        throw error;
    }
};

// ============================================
// Mock Analysis for Demo Mode
// ============================================

const generateMockAnalysis = (): GeminiAnalysisResult => {
    const categories = Object.values(GrievanceCategory);
    const jurisdictions = [Jurisdiction.BCC, Jurisdiction.CANTONMENT, Jurisdiction.VTU];

    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomJurisdiction = jurisdictions[Math.floor(Math.random() * jurisdictions.length)];
    const randomSeverity = Math.floor(Math.random() * 5) + 1;

    const descriptions: Record<GrievanceCategory, string> = {
        [GrievanceCategory.SOLID_WASTE]: 'Accumulated garbage and waste materials blocking the drainage area. Requires immediate attention for sanitation.',
        [GrievanceCategory.ROADS]: 'Damaged road surface with multiple potholes causing traffic hazards and vehicle damage.',
        [GrievanceCategory.WATER_SUPPLY]: 'Water supply pipe leakage causing wastage and road damage. Needs urgent repair.',
        [GrievanceCategory.DRAINAGE]: 'Blocked drainage causing water stagnation and potential mosquito breeding ground.',
        [GrievanceCategory.ELECTRICITY]: 'Damaged electrical infrastructure posing safety hazard to pedestrians.',
        [GrievanceCategory.STREET_LIGHTS]: 'Non-functional street lights creating dark zones affecting public safety.',
        [GrievanceCategory.ENCROACHMENT]: 'Unauthorized encroachment on public pathway obstructing pedestrian movement.',
        [GrievanceCategory.SANITATION]: 'Public area requiring sanitation attention for community health.',
        [GrievanceCategory.OTHER]: 'Civic issue requiring municipal attention for community welfare.',
    };

    return {
        category: randomCategory,
        severity_score: randomSeverity,
        description_summary: descriptions[randomCategory],
        suggested_jurisdiction: randomJurisdiction,
        detected_objects: ['infrastructure', 'public area', 'urban environment'],
    };
};

// ============================================
// Audio Transcription (for voice notes)
// ============================================

export const transcribeAudio = async (audioBase64: string): Promise<string> => {
    const ai = getAI();

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: 'audio/mp3',
                            data: audioBase64,
                        },
                    },
                    {
                        text: 'Transcribe this audio. The speaker may be using English, Kannada, Marathi, or Hindi. Provide the transcription in English.',
                    },
                ],
            },
        });

        return response.text || 'Unable to transcribe audio';
    } catch (error) {
        console.error('Transcription error:', error);
        return 'Audio transcription unavailable';
    }
};

export default analyzeGrievance;
