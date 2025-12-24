
import { GoogleGenAI, Type, FunctionDeclaration, GenerateContentResponse } from "@google/genai";
import { GrievanceCategory, Jurisdiction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const fileGrievanceTool: FunctionDeclaration = {
  name: 'file_grievance',
  parameters: {
    type: Type.OBJECT,
    description: 'Structure a civic grievance report based on visual and audio evidence.',
    properties: {
      category: {
        type: Type.STRING,
        enum: Object.values(GrievanceCategory),
        description: 'The type of civic issue observed.',
      },
      severity_score: {
        type: Type.INTEGER,
        description: 'Severity level from 1 (minor) to 5 (critical/emergency).',
      },
      description_summary: {
        type: Type.STRING,
        description: 'A concise summary of the issue in English.',
      },
      suggested_jurisdiction: {
        type: Type.STRING,
        enum: Object.values(Jurisdiction),
        description: 'The administrative body responsible for the location (BCC: Belagavi City Corp, CANTONMENT: Belgaum Cantonment, VTU: Visvesvaraya Technological University campus).',
      },
    },
    required: ['category', 'severity_score', 'description_summary', 'suggested_jurisdiction'],
  },
};

export const analyzeGrievance = async (imageBase64: string, audioBase64?: string) => {
  const parts: any[] = [
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64,
      },
    },
    {
      text: `Analyze this image (and accompanying audio if provided) from Belagavi, Karnataka. 
      The report might be in English, Kannada, or Marathi. 
      Identify the civic problem (trash, potholes, water leaks, etc.).
      Determine the jurisdiction:
      - Belagavi City Corporation (BCC) is the default for city areas.
      - Cantonment Board is for specific military/civil areas near Camp.
      - VTU Campus is for the university area.
      Return the structured data via the file_grievance function.`,
    },
  ];

  if (audioBase64) {
    parts.push({
      inlineData: {
        mimeType: 'audio/mp3',
        data: audioBase64,
      },
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
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
    if (call) {
      return call.args as {
        category: GrievanceCategory;
        severity_score: number;
        description_summary: string;
        suggested_jurisdiction: Jurisdiction;
      };
    }
    throw new Error("AI failed to generate a structured report.");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
