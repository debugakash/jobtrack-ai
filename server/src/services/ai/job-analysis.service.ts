import { NotFoundError } from "../../errors/index.js";
import { getJobById } from "../../repositories/job.repository.js";
import { getResumeById } from "../../repositories/resume.repository.js";
import { extractResumeText } from "../resume-text.service.js";
import type { JobAnalysisResult } from "../../dtos/ai.dto.js";
import { GeminiProvider } from "../../providers/ai/gemini.provider.js";

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

  const resumeText = await extractResumeText(resume.filePath);

  return aiProvider.analyzeJob({
    resumeText,
    jobDescription: job.description,
  });
}
