import { beforeEach, describe, expect, it, vi } from "vitest";

import prisma from "../config/prisma.js";
import { NotFoundError } from "../errors/NotFoundError.js";

import {
  createInterview,
  deleteInterview,
  getAllUserInterviews,
  getInterviewById,
  getInterviewsByJobId,
  updateInterview,
} from "../repositories/interview.repository.js";

import {
  createInterviewService,
  deleteInterviewService,
  getAllUserInterviewsService,
  getInterviewByIdService,
  getInterviewsService,
  updateInterviewService,
} from "./interview.service.js";

vi.mock("../config/prisma.js", () => ({
  default: {
    job: {
      findFirst: vi.fn(),
    },
    jobActivity: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("../repositories/interview.repository.js", () => ({
  createInterview: vi.fn(),
  deleteInterview: vi.fn(),
  getAllUserInterviews: vi.fn(),
  getInterviewById: vi.fn(),
  getInterviewsByJobId: vi.fn(),
  updateInterview: vi.fn(),
}));

describe("interview.service", () => {
  const userId = "user-123";
  const jobId = "job-123";
  const interviewId = "interview-123";

  const scheduledAt = new Date("2026-09-10T10:00:00.000Z");

  const interviewData = {
    round: "TECHNICAL",
    scheduledAt,
    interviewerName: "John Doe",
    notes: "Technical discussion",
  };

  const mockJob = {
    id: jobId,
    userId,
    status: "APPLIED",
  };

  const mockInterview = {
    id: interviewId,
    jobId,
    round: "TECHNICAL",
    scheduledAt,
    interviewerName: "John Doe",
    notes: "Technical discussion",
    completed: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // createInterviewService
  // ---------------------------------------------------------------------------

  describe("createInterviewService", () => {
    it("throws NotFoundError when the job does not exist", async () => {
      vi.mocked(prisma.job.findFirst).mockResolvedValue(null);

      await expect(
        createInterviewService(userId, jobId, interviewData),
      ).rejects.toThrow(new NotFoundError("Job not found"));

      expect(prisma.job.findFirst).toHaveBeenCalledWith({
        where: {
          id: jobId,
          userId,
        },
      });

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it("creates an interview for an existing job", async () => {
      vi.mocked(prisma.job.findFirst).mockResolvedValue(mockJob as never);

      const transaction = {
        interview: {
          create: vi.fn().mockResolvedValue(mockInterview),
        },
        job: {
          update: vi.fn().mockResolvedValue(mockJob),
        },
        jobActivity: {
          create: vi.fn().mockResolvedValue({ id: "activity-123" }),
        },
      };

      vi.mocked(prisma.$transaction).mockImplementation(async (callback) =>
        callback(transaction as never),
      );

      const result = await createInterviewService(userId, jobId, interviewData);

      expect(result).toEqual(mockInterview);

      expect(transaction.interview.create).toHaveBeenCalledWith({
        data: {
          ...interviewData,
          job: {
            connect: {
              id: jobId,
            },
          },
        },
      });
    });

    it.each(["WISHLIST", "APPLIED", "SCREENING"])(
      "changes job status to INTERVIEW when current status is %s",
      async (status) => {
        const job = {
          ...mockJob,
          status,
        };

        vi.mocked(prisma.job.findFirst).mockResolvedValue(job as never);

        const transaction = {
          interview: {
            create: vi.fn().mockResolvedValue(mockInterview),
          },
          job: {
            update: vi.fn().mockResolvedValue({
              ...job,
              status: "INTERVIEW",
            }),
          },
          jobActivity: {
            create: vi.fn().mockResolvedValue({
              id: "activity-123",
            }),
          },
        };

        vi.mocked(prisma.$transaction).mockImplementation(async (callback) =>
          callback(transaction as never),
        );

        await createInterviewService(userId, jobId, interviewData);

        expect(transaction.job.update).toHaveBeenCalledWith({
          where: {
            id: jobId,
          },
          data: {
            status: "INTERVIEW",
          },
        });

        expect(transaction.jobActivity.create).toHaveBeenCalledWith({
          data: {
            jobId,
            type: "INTERVIEW",
            title: "Interview scheduled",
            description: `${interviewData.round} interview scheduled.`,
            eventDate: interviewData.scheduledAt,
          },
        });
      },
    );

    it("does not change status when the job is already in INTERVIEW status", async () => {
      const job = {
        ...mockJob,
        status: "INTERVIEW",
      };

      vi.mocked(prisma.job.findFirst).mockResolvedValue(job as never);

      const transaction = {
        interview: {
          create: vi.fn().mockResolvedValue(mockInterview),
        },
        job: {
          update: vi.fn(),
        },
        jobActivity: {
          create: vi.fn(),
        },
      };

      vi.mocked(prisma.$transaction).mockImplementation(async (callback) =>
        callback(transaction as never),
      );

      await createInterviewService(userId, jobId, interviewData);

      expect(transaction.interview.create).toHaveBeenCalled();

      expect(transaction.job.update).not.toHaveBeenCalled();

      expect(transaction.jobActivity.create).not.toHaveBeenCalled();
    });

    it("does not change status when the job is already OFFER", async () => {
      const job = {
        ...mockJob,
        status: "OFFER",
      };

      vi.mocked(prisma.job.findFirst).mockResolvedValue(job as never);

      const transaction = {
        interview: {
          create: vi.fn().mockResolvedValue(mockInterview),
        },
        job: {
          update: vi.fn(),
        },
        jobActivity: {
          create: vi.fn(),
        },
      };

      vi.mocked(prisma.$transaction).mockImplementation(async (callback) =>
        callback(transaction as never),
      );

      await createInterviewService(userId, jobId, interviewData);

      expect(transaction.interview.create).toHaveBeenCalled();

      expect(transaction.job.update).not.toHaveBeenCalled();

      expect(transaction.jobActivity.create).not.toHaveBeenCalled();
    });

    it("returns the interview created inside the transaction", async () => {
      vi.mocked(prisma.job.findFirst).mockResolvedValue(mockJob as never);

      const transaction = {
        interview: {
          create: vi.fn().mockResolvedValue(mockInterview),
        },
        job: {
          update: vi.fn().mockResolvedValue(mockJob),
        },
        jobActivity: {
          create: vi.fn().mockResolvedValue({
            id: "activity-123",
          }),
        },
      };

      vi.mocked(prisma.$transaction).mockImplementation(async (callback) =>
        callback(transaction as never),
      );

      const result = await createInterviewService(userId, jobId, interviewData);

      expect(result).toBe(mockInterview);
    });
  });

  // ---------------------------------------------------------------------------
  // getInterviewsService
  // ---------------------------------------------------------------------------

  describe("getInterviewsService", () => {
    it("returns interviews for a job", async () => {
      const interviews = [
        mockInterview,
        {
          ...mockInterview,
          id: "interview-456",
        },
      ];

      vi.mocked(getInterviewsByJobId).mockResolvedValue(interviews as never);

      const result = await getInterviewsService(userId, jobId);

      expect(result).toEqual(interviews);

      expect(getInterviewsByJobId).toHaveBeenCalledWith(userId, jobId);
    });

    it("returns an empty array when the job has no interviews", async () => {
      vi.mocked(getInterviewsByJobId).mockResolvedValue([]);

      const result = await getInterviewsService(userId, jobId);

      expect(result).toEqual([]);

      expect(getInterviewsByJobId).toHaveBeenCalledWith(userId, jobId);
    });
  });

  // ---------------------------------------------------------------------------
  // getAllUserInterviewsService
  // ---------------------------------------------------------------------------

  describe("getAllUserInterviewsService", () => {
    it("returns all interviews for a user", async () => {
      const interviews = [
        mockInterview,
        {
          ...mockInterview,
          id: "interview-456",
          jobId: "job-456",
        },
      ];

      vi.mocked(getAllUserInterviews).mockResolvedValue(interviews as never);

      const result = await getAllUserInterviewsService(userId);

      expect(result).toEqual(interviews);

      expect(getAllUserInterviews).toHaveBeenCalledWith(userId);
    });

    it("returns an empty array when the user has no interviews", async () => {
      vi.mocked(getAllUserInterviews).mockResolvedValue([]);

      const result = await getAllUserInterviewsService(userId);

      expect(result).toEqual([]);

      expect(getAllUserInterviews).toHaveBeenCalledWith(userId);
    });
  });

  // ---------------------------------------------------------------------------
  // getInterviewByIdService
  // ---------------------------------------------------------------------------

  describe("getInterviewByIdService", () => {
    it("returns the interview when found", async () => {
      vi.mocked(getInterviewById).mockResolvedValue(mockInterview as never);

      const result = await getInterviewByIdService(userId, interviewId);

      expect(result).toEqual(mockInterview);

      expect(getInterviewById).toHaveBeenCalledWith(userId, interviewId);
    });

    it("throws NotFoundError when the interview does not exist", async () => {
      vi.mocked(getInterviewById).mockResolvedValue(null);

      await expect(
        getInterviewByIdService(userId, interviewId),
      ).rejects.toThrow(new NotFoundError("Interview not found"));

      expect(getInterviewById).toHaveBeenCalledWith(userId, interviewId);
    });
  });

  // ---------------------------------------------------------------------------
  // updateInterviewService
  // ---------------------------------------------------------------------------

  describe("updateInterviewService", () => {
    it("updates an existing interview", async () => {
      const updatedInterview = {
        ...mockInterview,
        interviewerName: "Jane Doe",
      };

      vi.mocked(getInterviewById)
        .mockResolvedValueOnce(mockInterview as never)
        .mockResolvedValueOnce(updatedInterview as never);

      vi.mocked(updateInterview).mockResolvedValue({
        count: 1,
      } as never);

      const updateData = {
        interviewerName: "Jane Doe",
      };

      const result = await updateInterviewService(
        userId,
        interviewId,
        updateData,
      );

      expect(updateInterview).toHaveBeenCalledWith(
        userId,
        interviewId,
        updateData,
      );

      expect(result).toEqual(updatedInterview);

      expect(prisma.jobActivity.create).not.toHaveBeenCalled();
    });

    it("throws NotFoundError when the existing interview does not exist", async () => {
      vi.mocked(getInterviewById).mockResolvedValue(null);

      await expect(
        updateInterviewService(userId, interviewId, {
          interviewerName: "Jane Doe",
        }),
      ).rejects.toThrow(new NotFoundError("Interview not found"));

      expect(updateInterview).not.toHaveBeenCalled();
    });

    it("throws NotFoundError when update affects no rows", async () => {
      vi.mocked(getInterviewById).mockResolvedValue(mockInterview as never);

      vi.mocked(updateInterview).mockResolvedValue({
        count: 0,
      } as never);

      await expect(
        updateInterviewService(userId, interviewId, {
          interviewerName: "Jane Doe",
        }),
      ).rejects.toThrow(new NotFoundError("Interview not found"));

      expect(updateInterview).toHaveBeenCalled();

      expect(prisma.jobActivity.create).not.toHaveBeenCalled();
    });

    it("creates an activity when an interview changes from incomplete to completed", async () => {
      vi.mocked(getInterviewById)
        .mockResolvedValueOnce(mockInterview as never)
        .mockResolvedValueOnce({
          ...mockInterview,
          completed: true,
        } as never);

      vi.mocked(updateInterview).mockResolvedValue({
        count: 1,
      } as never);

      vi.mocked(prisma.jobActivity.create).mockResolvedValue({
        id: "activity-123",
      } as never);

      await updateInterviewService(userId, interviewId, {
        completed: true,
      });

      expect(prisma.jobActivity.create).toHaveBeenCalledWith({
        data: {
          jobId,
          type: "INTERVIEW",
          title: "Interview completed",
          description: `${mockInterview.round} interview was completed.`,
          eventDate: expect.any(Date),
        },
      });
    });

    it("does not create an activity when an interview remains incomplete", async () => {
      vi.mocked(getInterviewById)
        .mockResolvedValueOnce(mockInterview as never)
        .mockResolvedValueOnce(mockInterview as never);

      vi.mocked(updateInterview).mockResolvedValue({
        count: 1,
      } as never);

      await updateInterviewService(userId, interviewId, {
        completed: false,
      });

      expect(prisma.jobActivity.create).not.toHaveBeenCalled();
    });

    it("does not create a completion activity when the interview was already completed", async () => {
      const completedInterview = {
        ...mockInterview,
        completed: true,
      };

      vi.mocked(getInterviewById)
        .mockResolvedValueOnce(completedInterview as never)
        .mockResolvedValueOnce(completedInterview as never);

      vi.mocked(updateInterview).mockResolvedValue({
        count: 1,
      } as never);

      await updateInterviewService(userId, interviewId, {
        completed: true,
      });

      expect(prisma.jobActivity.create).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // deleteInterviewService
  // ---------------------------------------------------------------------------

  describe("deleteInterviewService", () => {
    it("deletes an existing interview", async () => {
      vi.mocked(deleteInterview).mockResolvedValue({
        count: 1,
      } as never);

      await expect(
        deleteInterviewService(userId, interviewId),
      ).resolves.toBeUndefined();

      expect(deleteInterview).toHaveBeenCalledWith(userId, interviewId);
    });

    it("throws NotFoundError when the interview does not exist", async () => {
      vi.mocked(deleteInterview).mockResolvedValue({
        count: 0,
      } as never);

      await expect(deleteInterviewService(userId, interviewId)).rejects.toThrow(
        new NotFoundError("Interview not found"),
      );

      expect(deleteInterview).toHaveBeenCalledWith(userId, interviewId);
    });
  });
});
