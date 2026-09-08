import { beforeEach, describe, expect, it, vi } from "vitest";

import { AIServiceError, NotFoundError } from "../../errors/index.js";

import { getJobById } from "../../repositories/job.repository.js";
import { getResumeById } from "../../repositories/resume.repository.js";

import {
  createJobAiAnalysis,
  getJobAiAnalysis,
  updateJobAiAnalysis,
} from "../../repositories/job-ai-analysis.repository.js";

import { extractResumeText } from "../resume-text.service.js";
import { storageService } from "../storage/index.js";

const { analyzeJobMock } = vi.hoisted(() => ({
  analyzeJobMock: vi.fn(),
}));

import { analyzeJob } from "./job-analysis.service.js";

vi.mock("../../repositories/job.repository.js", () => ({
  getJobById: vi.fn(),
}));

vi.mock("../../repositories/resume.repository.js", () => ({
  getResumeById: vi.fn(),
}));

vi.mock("../../repositories/job-ai-analysis.repository.js", () => ({
  createJobAiAnalysis: vi.fn(),
  getJobAiAnalysis: vi.fn(),
  updateJobAiAnalysis: vi.fn(),
}));

vi.mock("../resume-text.service.js", () => ({
  extractResumeText: vi.fn(),
}));

vi.mock("../storage/index.js", () => ({
  storageService: {
    getFileBuffer: vi.fn(),
  },
}));

vi.mock("../../providers/ai/gemini.provider.js", () => ({
  GeminiProvider: class {
    analyzeJob = analyzeJobMock;
  },
}));

describe("job-analysis.service", () => {
  const userId = "user-123";
  const jobId = "job-123";
  const resumeId = "resume-123";

  const resumeBuffer = Buffer.from("resume content");

  const resumeText =
    "Experienced React and TypeScript developer with Node.js experience.";

  const jobDescription =
    "Looking for a React developer with TypeScript and Node.js experience.";

  const mockJob = {
    id: jobId,
    userId,
    company: "Acme Corp",
    jobTitle: "Frontend Developer",
    description: jobDescription,
    resumeId,
  };

  const mockResume = {
    id: resumeId,
    userId,
    filePath: "resumes/resume-123.pdf",
    originalName: "resume.pdf",
  };

  const analysisResult = {
    matchScore: 85,
    matchingSkills: ["React", "TypeScript", "Node.js"],
    missingSkills: ["AWS"],
    suggestions: [
      "Highlight your cloud experience.",
      "Add AWS-related projects if applicable.",
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getJobById).mockResolvedValue(mockJob as never);

    vi.mocked(getResumeById).mockResolvedValue(mockResume as never);

    vi.mocked(storageService.getFileBuffer).mockResolvedValue(resumeBuffer);

    vi.mocked(extractResumeText).mockResolvedValue(resumeText);

    vi.mocked(getJobAiAnalysis).mockResolvedValue(null);

    vi.mocked(createJobAiAnalysis).mockResolvedValue({
      id: "analysis-123",
    } as never);

    vi.mocked(updateJobAiAnalysis).mockResolvedValue({
      id: "analysis-123",
    } as never);

    analyzeJobMock.mockResolvedValue(analysisResult);
  });

  // ---------------------------------------------------------------------------
  // Prerequisites
  // ---------------------------------------------------------------------------

  describe("prerequisites", () => {
    it("throws NotFoundError when the job does not exist", async () => {
      vi.mocked(getJobById).mockResolvedValue(null);

      await expect(analyzeJob(userId, jobId)).rejects.toThrow(
        new NotFoundError("Job not found."),
      );

      expect(getJobById).toHaveBeenCalledWith(userId, jobId);

      expect(getResumeById).not.toHaveBeenCalled();

      expect(storageService.getFileBuffer).not.toHaveBeenCalled();

      expect(extractResumeText).not.toHaveBeenCalled();

      expect(analyzeJobMock).not.toHaveBeenCalled();
    });

    it("throws NotFoundError when the job has no description", async () => {
      vi.mocked(getJobById).mockResolvedValue({
        ...mockJob,
        description: null,
      } as never);

      await expect(analyzeJob(userId, jobId)).rejects.toThrow(
        new NotFoundError("Job description is required before AI analysis."),
      );

      expect(getResumeById).not.toHaveBeenCalled();

      expect(storageService.getFileBuffer).not.toHaveBeenCalled();

      expect(analyzeJobMock).not.toHaveBeenCalled();
    });

    it("throws NotFoundError when the job description is empty", async () => {
      vi.mocked(getJobById).mockResolvedValue({
        ...mockJob,
        description: "   ",
      } as never);

      await expect(analyzeJob(userId, jobId)).rejects.toThrow(
        new NotFoundError("Job description is required before AI analysis."),
      );

      expect(getResumeById).not.toHaveBeenCalled();

      expect(analyzeJobMock).not.toHaveBeenCalled();
    });

    it("throws NotFoundError when the job has no attached resume", async () => {
      vi.mocked(getJobById).mockResolvedValue({
        ...mockJob,
        resumeId: null,
      } as never);

      await expect(analyzeJob(userId, jobId)).rejects.toThrow(
        new NotFoundError(
          "A resume must be attached to the job before AI analysis.",
        ),
      );

      expect(getResumeById).not.toHaveBeenCalled();

      expect(storageService.getFileBuffer).not.toHaveBeenCalled();

      expect(analyzeJobMock).not.toHaveBeenCalled();
    });

    it("throws NotFoundError when the attached resume does not exist", async () => {
      vi.mocked(getResumeById).mockResolvedValue(null);

      await expect(analyzeJob(userId, jobId)).rejects.toThrow(
        new NotFoundError("Resume not found."),
      );

      expect(getResumeById).toHaveBeenCalledWith(userId, resumeId);

      expect(storageService.getFileBuffer).not.toHaveBeenCalled();

      expect(extractResumeText).not.toHaveBeenCalled();

      expect(analyzeJobMock).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Successful analysis
  // ---------------------------------------------------------------------------

  describe("successful analysis", () => {
    it("loads the job and attached resume before running AI analysis", async () => {
      await analyzeJob(userId, jobId);

      expect(getJobById).toHaveBeenCalledWith(userId, jobId);

      expect(getResumeById).toHaveBeenCalledWith(userId, resumeId);

      expect(storageService.getFileBuffer).toHaveBeenCalledWith(
        mockResume.filePath,
      );

      expect(extractResumeText).toHaveBeenCalledWith(resumeBuffer);

      expect(analyzeJobMock).toHaveBeenCalled();
    });

    it("passes resume text and job description to the AI provider", async () => {
      await analyzeJob(userId, jobId);

      expect(analyzeJobMock).toHaveBeenCalledWith({
        resumeText,
        jobDescription,
      });
    });

    it("returns the AI analysis result", async () => {
      const result = await analyzeJob(userId, jobId);

      expect(result).toEqual(analysisResult);
    });

    it("creates a new analysis when no existing analysis exists", async () => {
      vi.mocked(getJobAiAnalysis).mockResolvedValue(null);

      await analyzeJob(userId, jobId);

      expect(createJobAiAnalysis).toHaveBeenCalledWith({
        job: {
          connect: {
            id: jobId,
          },
        },
        resume: {
          connect: {
            id: resumeId,
          },
        },
        matchScore: analysisResult.matchScore,
        matchingSkills: analysisResult.matchingSkills,
        missingSkills: analysisResult.missingSkills,
        suggestions: analysisResult.suggestions,
        provider: "gemini",
        model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
      });

      expect(updateJobAiAnalysis).not.toHaveBeenCalled();
    });

    it("updates the existing analysis when one already exists", async () => {
      const existingAnalysis = {
        id: "analysis-123",
        jobId,
        resumeId,
      };

      vi.mocked(getJobAiAnalysis).mockResolvedValue(existingAnalysis as never);

      await analyzeJob(userId, jobId);

      expect(updateJobAiAnalysis).toHaveBeenCalledWith(jobId, {
        matchScore: analysisResult.matchScore,
        matchingSkills: analysisResult.matchingSkills,
        missingSkills: analysisResult.missingSkills,
        suggestions: analysisResult.suggestions,
        provider: "gemini",
        model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
        resume: {
          connect: {
            id: resumeId,
          },
        },
      });

      expect(createJobAiAnalysis).not.toHaveBeenCalled();
    });

    it("uses the configured GEMINI_MODEL when available", async () => {
      const originalModel = process.env.GEMINI_MODEL;

      process.env.GEMINI_MODEL = "custom-gemini-model";

      try {
        await analyzeJob(userId, jobId);

        expect(createJobAiAnalysis).toHaveBeenCalledWith(
          expect.objectContaining({
            model: "custom-gemini-model",
          }),
        );
      } finally {
        if (originalModel === undefined) {
          delete process.env.GEMINI_MODEL;
        } else {
          process.env.GEMINI_MODEL = originalModel;
        }
      }
    });
  });

  // ---------------------------------------------------------------------------
  // AI errors
  // ---------------------------------------------------------------------------

  describe("AI error handling", () => {
    it("converts a 429 AI provider error into an AIServiceError", async () => {
      const error = Object.assign(new Error("Too many requests"), {
        status: 429,
      });

      analyzeJobMock.mockRejectedValueOnce(error);

      await expect(analyzeJob(userId, jobId)).rejects.toThrow(
        new AIServiceError(
          "AI service rate limit reached. Please wait a moment and try again.",
          429,
        ),
      );

      expect(createJobAiAnalysis).not.toHaveBeenCalled();

      expect(updateJobAiAnalysis).not.toHaveBeenCalled();
    });

    it("converts a 503 AI provider error into an AIServiceError", async () => {
      const error = Object.assign(new Error("Service unavailable"), {
        status: 503,
      });

      analyzeJobMock.mockRejectedValueOnce(error);

      await expect(analyzeJob(userId, jobId)).rejects.toThrow(
        new AIServiceError(
          "AI service is temporarily busy. Please try again in a moment.",
          503,
        ),
      );

      expect(createJobAiAnalysis).not.toHaveBeenCalled();

      expect(updateJobAiAnalysis).not.toHaveBeenCalled();
    });

    it("converts an unknown AI provider error into a generic AIServiceError", async () => {
      const error = new Error("Unexpected AI failure");

      analyzeJobMock.mockRejectedValueOnce(error);

      await expect(analyzeJob(userId, jobId)).rejects.toThrow(
        new AIServiceError("AI analysis failed. Please try again later.", 503),
      );

      expect(createJobAiAnalysis).not.toHaveBeenCalled();

      expect(updateJobAiAnalysis).not.toHaveBeenCalled();
    });

    it("converts an error with a non-numeric status into a generic AIServiceError", async () => {
      const error = {
        status: "503",
        message: "Service unavailable",
      };

      analyzeJobMock.mockRejectedValueOnce(error);

      await expect(analyzeJob(userId, jobId)).rejects.toThrow(
        new AIServiceError("AI analysis failed. Please try again later.", 503),
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Persistence errors
  // ---------------------------------------------------------------------------

  describe("analysis persistence errors", () => {
    it("converts an error while creating the analysis into an AIServiceError", async () => {
      vi.mocked(getJobAiAnalysis).mockResolvedValue(null);

      vi.mocked(createJobAiAnalysis).mockRejectedValue(
        new Error("Database error"),
      );

      await expect(analyzeJob(userId, jobId)).rejects.toThrow(
        new AIServiceError("AI analysis failed. Please try again later.", 503),
      );
    });

    it("converts an error while updating the analysis into an AIServiceError", async () => {
      vi.mocked(getJobAiAnalysis).mockResolvedValue({
        id: "analysis-123",
      } as never);

      vi.mocked(updateJobAiAnalysis).mockRejectedValue(
        new Error("Database error"),
      );

      await expect(analyzeJob(userId, jobId)).rejects.toThrow(
        new AIServiceError("AI analysis failed. Please try again later.", 503),
      );
    });
  });
});
