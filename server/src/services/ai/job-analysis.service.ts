import { AIServiceError, NotFoundError } from "../../errors/index.js";
import { getJobById } from "../../repositories/job.repository.js";
import { getResumeById } from "../../repositories/resume.repository.js";
import { extractResumeText } from "../resume-text.service.js";
import type { JobAnalysisResult } from "../../dtos/ai.dto.js";
import { GeminiProvider } from "../../providers/ai/gemini.provider.js";

import {
  createJobAiAnalysis,
  getJobAiAnalysis,
  updateJobAiAnalysis,
} from "../../repositories/job-ai-analysis.repository.js";
import { storageService } from "../storage/index.js";

const aiProvider = new GeminiProvider();

export async function analyzeJob(
  userId: string,
  jobId: string,
): Promise<JobAnalysisResult> {
  const job = await getJobById(userId, jobId);

  if (!job) {
    throw new NotFoundError("Job not found.");
  }

  if (!job.description?.trim()) {
    throw new NotFoundError("Job description is required before AI analysis.");
  }

  if (!job.resumeId) {
    throw new NotFoundError(
      "A resume must be attached to the job before AI analysis.",
    );
  }

  const resume = await getResumeById(userId, job.resumeId);

  if (!resume) {
    throw new NotFoundError("Resume not found.");
  }

  const resumeBuffer = await storageService.getFileBuffer(resume.filePath);

  const resumeText = await extractResumeText(resumeBuffer);

  try {
    const result = await aiProvider.analyzeJob({
      resumeText,
      jobDescription: job.description,
    });

    const existingAnalysis = await getJobAiAnalysis(jobId);

    if (existingAnalysis) {
      await updateJobAiAnalysis(jobId, {
        matchScore: result.matchScore,
        matchingSkills: result.matchingSkills,
        missingSkills: result.missingSkills,
        suggestions: result.suggestions,
        provider: "gemini",
        model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
        resume: {
          connect: {
            id: resume.id,
          },
        },
      });
    } else {
      await createJobAiAnalysis({
        job: {
          connect: {
            id: jobId,
          },
        },
        resume: {
          connect: {
            id: resume.id,
          },
        },
        matchScore: result.matchScore,
        matchingSkills: result.matchingSkills,
        missingSkills: result.missingSkills,
        suggestions: result.suggestions,
        provider: "gemini",
        model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
      });
    }

    return result;
  } catch (error: unknown) {
    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof error.status === "number"
        ? error.status
        : undefined;

    if (status === 429) {
      throw new AIServiceError(
        "AI service rate limit reached. Please wait a moment and try again.",
        429,
      );
    }

    if (status === 503) {
      throw new AIServiceError(
        "AI service is temporarily busy. Please try again in a moment.",
        503,
      );
    }

    throw new AIServiceError(
      "AI analysis failed. Please try again later.",
      503,
    );
  }
}
