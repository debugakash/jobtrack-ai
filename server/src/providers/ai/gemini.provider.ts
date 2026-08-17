import { GoogleGenAI, Type } from "@google/genai";

import type { JobAnalysisResult } from "../../dtos/ai.dto.js";
import type { AiProvider } from "./ai.provider.js";

export class GeminiProvider implements AiProvider {
  private readonly client: GoogleGenAI;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    this.client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async analyzeJob({
    resumeText,
    jobDescription,
  }: {
    resumeText: string;
    jobDescription: string;
  }): Promise<JobAnalysisResult> {
    const response = await this.client.models.generateContent({
      model: "gemini-3.6-flash",

      contents: `
You are an expert technical recruiter.

Analyze how well the candidate's resume matches the job description.

Be objective, concise, and evidence-based.

Resume:
${resumeText}

Job Description:
${jobDescription}

Return:
- matchScore: overall match from 0 to 100
- matchingSkills: skills from the job description that the resume demonstrates
- missingSkills: important job requirements that are missing or insufficiently demonstrated
- suggestions: practical suggestions for improving the candidate's resume for this job

Do not invent experience that is not present in the resume.
      `.trim(),

      config: {
        responseMimeType: "application/json",

        responseSchema: {
          type: Type.OBJECT,

          properties: {
            matchScore: {
              type: Type.INTEGER,
              minimum: 0,
              maximum: 100,
            },

            matchingSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },

            missingSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },

            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
          },

          required: [
            "matchScore",
            "matchingSkills",
            "missingSkills",
            "suggestions",
          ],
        },
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("Gemini provider returned an empty response.");
    }

    let result: JobAnalysisResult;

    try {
      result = JSON.parse(text) as JobAnalysisResult;
    } catch {
      throw new Error("Gemini provider returned invalid JSON.");
    }

    return result;
  }
}
