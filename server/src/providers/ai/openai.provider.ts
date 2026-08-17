import OpenAI from "openai";

import type { JobAnalysisResult } from "../../dtos/ai.dto.js";
import type { AiProvider } from "./ai.provider.js";

export class OpenAiProvider implements AiProvider {
  private readonly client: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured.");
    }

    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyzeJob({
    resumeText,
    jobDescription,
  }: {
    resumeText: string;
    jobDescription: string;
  }): Promise<JobAnalysisResult> {
    const response = await this.client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6",

      input: [
        {
          role: "system",
          content:
            "You are an expert technical recruiter. Analyze how well a candidate's resume matches a job description. Be objective, concise, and evidence-based.",
        },
        {
          role: "user",
          content: `
Resume:
${resumeText}

Job Description:
${jobDescription}

Analyze the candidate against the job description.
      `.trim(),
        },
      ],

      text: {
        format: {
          type: "json_schema",
          name: "job_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              matchScore: {
                type: "integer",
                minimum: 0,
                maximum: 100,
              },
              matchingSkills: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              missingSkills: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              suggestions: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            required: [
              "matchScore",
              "matchingSkills",
              "missingSkills",
              "suggestions",
            ],
            additionalProperties: false,
          },
        },
      },
    });

    const text = response.output_text;

    if (!text) {
      throw new Error("AI provider returned an empty response.");
    }

    let result: JobAnalysisResult;

    try {
      result = JSON.parse(text) as JobAnalysisResult;
    } catch {
      throw new Error("AI provider returned invalid JSON.");
    }

    return result;
  }
}
