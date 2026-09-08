import { beforeEach, describe, expect, it, vi } from "vitest";
import { JobActivityType } from "@prisma/client";

import {
  createJobService,
  deleteJobService,
  getJobByIdService,
  getJobsService,
  updateJobService,
} from "./job.service.js";

import {
  createJob,
  deleteJob,
  getJobById,
  getJobsByUserId,
  updateJob,
} from "../repositories/job.repository.js";

import { getResumeById } from "../repositories/resume.repository.js";

import {
  addJobActivity,
  handleStatusChangeActivity,
} from "./job-activity.service.js";

import { NotFoundError } from "../errors/index.js";

vi.mock("../repositories/job.repository.js", () => ({
  createJob: vi.fn(),
  deleteJob: vi.fn(),
  getJobById: vi.fn(),
  getJobsByUserId: vi.fn(),
  updateJob: vi.fn(),
}));

vi.mock("../repositories/resume.repository.js", () => ({
  getResumeById: vi.fn(),
}));

vi.mock("./job-activity.service.js", () => ({
  addJobActivity: vi.fn(),
  handleStatusChangeActivity: vi.fn(),
}));

const userId = "user-123";
const jobId = "job-123";

const mockJob = {
  id: jobId,
  userId,
  company: "Acme Corp",
  jobTitle: "Frontend Developer",
  description: "React developer",
  location: "Remote",
  jobType: "FULL_TIME",
  workMode: "REMOTE",
  status: "APPLIED",
  salaryMin: 80000,
  salaryMax: 100000,
  source: "LINKEDIN",
  jobUrl: "https://example.com/job",
  notes: null,
  resumeId: null,
  followUpDate: null,
  followUpDone: false,
  appliedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  resume: null,
  activities: [],
  interviews: [],
  aiAnalysis: null,
};

const mockResume = {
  id: "resume-123",
  userId,
  label: "Frontend Resume",
  originalName: "resume.pdf",
};

const baseJobData = {
  company: "Acme Corp",
  jobTitle: "Frontend Developer",
  jobType: "FULL_TIME" as const,
  workMode: "REMOTE" as const,
};

describe("job.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(addJobActivity).mockResolvedValue(undefined as never);
    vi.mocked(handleStatusChangeActivity).mockResolvedValue(undefined);
  });

  describe("createJobService", () => {
    it("creates a job with APPLIED as the default status", async () => {
      vi.mocked(createJob).mockResolvedValue(mockJob as never);

      await createJobService(userId, baseJobData);

      expect(createJob).toHaveBeenCalledWith(
        expect.objectContaining({
          ...baseJobData,
          appliedAt: expect.any(Date),
          user: {
            connect: {
              id: userId,
            },
          },
        }),
      );
    });

    it("sets appliedAt to null when creating a WISHLIST job", async () => {
      vi.mocked(createJob).mockResolvedValue(mockJob as never);

      await createJobService(userId, {
        ...baseJobData,
        status: "WISHLIST",
      });

      expect(createJob).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "WISHLIST",
          appliedAt: null,
        }),
      );
    });

    it("sets appliedAt when creating an applied job", async () => {
      vi.mocked(createJob).mockResolvedValue(mockJob as never);

      await createJobService(userId, {
        ...baseJobData,
        status: "APPLIED",
      });

      const call = vi.mocked(createJob).mock.calls[0][0];

      expect(call.appliedAt).toBeInstanceOf(Date);
    });

    it("adds a CREATED activity after creating the job", async () => {
      vi.mocked(createJob).mockResolvedValue(mockJob as never);

      await createJobService(userId, baseJobData);

      expect(addJobActivity).toHaveBeenCalledWith(
        jobId,
        JobActivityType.CREATED,
        "Added Acme Corp",
        'Job "Frontend Developer" was added to the tracker.',
      );
    });

    it("returns the created job", async () => {
      vi.mocked(createJob).mockResolvedValue(mockJob as never);

      const result = await createJobService(userId, baseJobData);

      expect(result).toBe(mockJob);
    });
  });

  describe("getJobsService", () => {
    it("passes the user id and query to the repository", async () => {
      const query = {
        page: 1,
        limit: 10,
      };

      const result = {
        jobs: [mockJob],
        total: 1,
      };

      vi.mocked(getJobsByUserId).mockResolvedValue(result as never);

      const response = await getJobsService(userId, query);

      expect(getJobsByUserId).toHaveBeenCalledWith(userId, query);
      expect(response).toBe(result);
    });
  });

  describe("getJobByIdService", () => {
    it("returns the job when found", async () => {
      vi.mocked(getJobById).mockResolvedValue(mockJob as never);

      const result = await getJobByIdService(userId, jobId);

      expect(getJobById).toHaveBeenCalledWith(userId, jobId);
      expect(result).toBe(mockJob);
    });

    it("throws NotFoundError when the job does not exist", async () => {
      vi.mocked(getJobById).mockResolvedValue(null);

      await expect(getJobByIdService(userId, jobId)).rejects.toBeInstanceOf(
        NotFoundError,
      );
    });
  });

  describe("updateJobService", () => {
    it("updates a job successfully", async () => {
      vi.mocked(getJobById)
        .mockResolvedValueOnce(mockJob as never)
        .mockResolvedValueOnce({
          ...mockJob,
          company: "Updated Corp",
        } as never);

      vi.mocked(updateJob).mockResolvedValue({ count: 1 });

      const result = await updateJobService(userId, jobId, {
        company: "Updated Corp",
      });

      expect(updateJob).toHaveBeenCalledWith(
        userId,
        jobId,
        expect.objectContaining({
          company: "Updated Corp",
        }),
      );

      expect(result).toEqual(
        expect.objectContaining({
          company: "Updated Corp",
        }),
      );
    });

    it("throws NotFoundError when the existing job does not exist", async () => {
      vi.mocked(getJobById).mockResolvedValue(null);

      await expect(
        updateJobService(userId, jobId, {
          company: "Updated Corp",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);

      expect(updateJob).not.toHaveBeenCalled();
    });

    it("detects a status change and records the activity", async () => {
      vi.mocked(getJobById)
        .mockResolvedValueOnce(mockJob as never)
        .mockResolvedValueOnce({
          ...mockJob,
          status: "INTERVIEW",
        } as never);

      vi.mocked(updateJob).mockResolvedValue({ count: 1 });

      await updateJobService(userId, jobId, {
        status: "INTERVIEW",
      });

      expect(handleStatusChangeActivity).toHaveBeenCalledWith(
        jobId,
        "APPLIED",
        "INTERVIEW",
      );
    });

    it("sets appliedAt when moving from WISHLIST to an applied stage", async () => {
      const wishlistJob = {
        ...mockJob,
        status: "WISHLIST",
        appliedAt: null,
      };

      vi.mocked(getJobById)
        .mockResolvedValueOnce(wishlistJob as never)
        .mockResolvedValueOnce({
          ...wishlistJob,
          status: "APPLIED",
          appliedAt: new Date(),
        } as never);

      vi.mocked(updateJob).mockResolvedValue({ count: 1 });

      await updateJobService(userId, jobId, {
        status: "APPLIED",
      });

      expect(updateJob).toHaveBeenCalledWith(
        userId,
        jobId,
        expect.objectContaining({
          status: "APPLIED",
          appliedAt: expect.any(Date),
        }),
      );
    });

    it("does not overwrite an existing appliedAt date", async () => {
      const existingAppliedAt = new Date("2026-01-01");

      const job = {
        ...mockJob,
        status: "WISHLIST",
        appliedAt: existingAppliedAt,
      };

      vi.mocked(getJobById)
        .mockResolvedValueOnce(job as never)
        .mockResolvedValueOnce(job as never);

      vi.mocked(updateJob).mockResolvedValue({ count: 1 });

      await updateJobService(userId, jobId, {
        status: "APPLIED",
      });

      const updateData = vi.mocked(updateJob).mock.calls[0][2];

      expect(updateData.appliedAt).toBeUndefined();
    });

    it("validates that an attached resume belongs to the user", async () => {
      vi.mocked(getJobById).mockResolvedValue(mockJob as never);
      vi.mocked(getResumeById).mockResolvedValue(null);

      await expect(
        updateJobService(userId, jobId, {
          resumeId: "resume-123",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);

      expect(updateJob).not.toHaveBeenCalled();
    });

    it("allows attaching a resume belonging to the user", async () => {
      vi.mocked(getJobById)
        .mockResolvedValueOnce(mockJob as never)
        .mockResolvedValueOnce({
          ...mockJob,
          resumeId: mockResume.id,
          resume: mockResume,
        } as never);

      vi.mocked(getResumeById).mockResolvedValue(mockResume as never);
      vi.mocked(updateJob).mockResolvedValue({ count: 1 });

      await updateJobService(userId, jobId, {
        resumeId: mockResume.id,
      });

      expect(getResumeById).toHaveBeenCalledWith(userId, mockResume.id);

      expect(updateJob).toHaveBeenCalled();
    });

    it("records a resume attachment activity", async () => {
      vi.mocked(getJobById)
        .mockResolvedValueOnce(mockJob as never)
        .mockResolvedValueOnce({
          ...mockJob,
          resumeId: mockResume.id,
          resume: mockResume,
        } as never);

      vi.mocked(getResumeById).mockResolvedValue(mockResume as never);
      vi.mocked(updateJob).mockResolvedValue({ count: 1 });

      await updateJobService(userId, jobId, {
        resumeId: mockResume.id,
      });

      expect(addJobActivity).toHaveBeenCalledWith(
        jobId,
        JobActivityType.RESUME,
        "Resume attached",
        `"${mockResume.label}" was attached to this job.`,
      );
    });

    it("records a resume removal activity", async () => {
      const jobWithResume = {
        ...mockJob,
        resumeId: mockResume.id,
        resume: mockResume,
      };

      vi.mocked(getJobById)
        .mockResolvedValueOnce(jobWithResume as never)
        .mockResolvedValueOnce({
          ...mockJob,
          resumeId: null,
          resume: null,
        } as never);

      vi.mocked(updateJob).mockResolvedValue({ count: 1 });

      await updateJobService(userId, jobId, {
        resumeId: null,
      });

      expect(addJobActivity).toHaveBeenCalledWith(
        jobId,
        JobActivityType.RESUME,
        "Resume removed",
        `"${mockResume.label}" was removed from this job.`,
      );
    });

    it("records a resume replacement activity", async () => {
      const oldResume = {
        id: "resume-old",
        userId,
        label: "Old Resume",
        originalName: "old.pdf",
      };

      const newResume = {
        id: "resume-new",
        userId,
        label: "New Resume",
        originalName: "new.pdf",
      };

      const jobWithOldResume = {
        ...mockJob,
        resumeId: oldResume.id,
        resume: oldResume,
      };

      vi.mocked(getJobById)
        .mockResolvedValueOnce(jobWithOldResume as never)
        .mockResolvedValueOnce({
          ...mockJob,
          resumeId: newResume.id,
          resume: newResume,
        } as never);

      vi.mocked(getResumeById).mockResolvedValue(newResume as never);
      vi.mocked(updateJob).mockResolvedValue({ count: 1 });

      await updateJobService(userId, jobId, {
        resumeId: newResume.id,
      });

      expect(addJobActivity).toHaveBeenCalledWith(
        jobId,
        JobActivityType.RESUME,
        "Resume changed",
        'Resume changed from "Old Resume" to "New Resume".',
      );
    });

    it("throws NotFoundError when updateJob affects no rows", async () => {
      vi.mocked(getJobById).mockResolvedValue(mockJob as never);
      vi.mocked(updateJob).mockResolvedValue({ count: 0 });

      await expect(
        updateJobService(userId, jobId, {
          company: "Updated Corp",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("deleteJobService", () => {
    it("deletes the job successfully", async () => {
      vi.mocked(deleteJob).mockResolvedValue({ count: 1 });

      await expect(deleteJobService(userId, jobId)).resolves.toBeUndefined();

      expect(deleteJob).toHaveBeenCalledWith(userId, jobId);
    });

    it("throws NotFoundError when the job does not exist", async () => {
      vi.mocked(deleteJob).mockResolvedValue({ count: 0 });

      await expect(deleteJobService(userId, jobId)).rejects.toBeInstanceOf(
        NotFoundError,
      );
    });
  });
});
