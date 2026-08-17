import type { JobAnalysisResult } from "../../dtos/ai.dto.js";

export interface AiProvider {
  analyzeJob(input: {
    resumeText: string;
    jobDescription: string;
  }): Promise<JobAnalysisResult>;
}
