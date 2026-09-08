import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createJobActivity,
  getActivitiesByJobId,
} from "../repositories/job-activity.repository.js";

import {
  addJobActivity,
  getJobActivities,
  handleStatusChangeActivity,
} from "./job-activity.service.js";

vi.mock("../repositories/job-activity.repository.js", () => ({
  createJobActivity: vi.fn(),
  getActivitiesByJobId: vi.fn(),
}));

const jobId = "job-123";
const userId = "user-123";

describe("job-activity.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("addJobActivity", () => {
    it("creates a job activity with the provided data", async () => {
      const activity = {
        id: "activity-123",
        jobId,
        type: "CREATED",
        title: "Added Acme Corp",
      };

      vi.mocked(createJobActivity).mockResolvedValue(activity as never);

      const eventDate = new Date("2026-09-08T10:00:00.000Z");

      const result = await addJobActivity(
        jobId,
        "CREATED",
        "Added Acme Corp",
        "Job was added.",
        eventDate,
      );

      expect(createJobActivity).toHaveBeenCalledWith(
        jobId,
        "CREATED",
        "Added Acme Corp",
        "Job was added.",
        eventDate,
      );

      expect(result).toBe(activity);
    });

    it("allows the description and event date to be omitted", async () => {
      vi.mocked(createJobActivity).mockResolvedValue({} as never);

      await addJobActivity(jobId, "CREATED", "Job created");

      expect(createJobActivity).toHaveBeenCalledWith(
        jobId,
        "CREATED",
        "Job created",
        undefined,
        undefined,
      );
    });
  });

  describe("handleStatusChangeActivity", () => {
    it("always creates a STATUS_CHANGED activity", async () => {
      vi.mocked(createJobActivity).mockResolvedValue({} as never);

      await handleStatusChangeActivity(jobId, "APPLIED", "SCREENING");

      expect(createJobActivity).toHaveBeenCalledWith(
        jobId,
        "STATUS_CHANGED",
        "Status changed to SCREENING",
        "Status changed from APPLIED to SCREENING",
        undefined,
      );

      expect(createJobActivity).toHaveBeenCalledTimes(1);
    });

    it("creates an interview activity when status changes to INTERVIEW", async () => {
      vi.mocked(createJobActivity).mockResolvedValue({} as never);

      await handleStatusChangeActivity(jobId, "SCREENING", "INTERVIEW");

      expect(createJobActivity).toHaveBeenNthCalledWith(
        1,
        jobId,
        "STATUS_CHANGED",
        "Status changed to INTERVIEW",
        "Status changed from SCREENING to INTERVIEW",
        undefined,
      );

      expect(createJobActivity).toHaveBeenNthCalledWith(
        2,
        jobId,
        "INTERVIEW",
        "Interview Scheduled",
        "Interview stage reached.",
        undefined,
      );

      expect(createJobActivity).toHaveBeenCalledTimes(2);
    });

    it("creates an offer activity when status changes to OFFER", async () => {
      vi.mocked(createJobActivity).mockResolvedValue({} as never);

      await handleStatusChangeActivity(jobId, "INTERVIEW", "OFFER");

      expect(createJobActivity).toHaveBeenNthCalledWith(
        1,
        jobId,
        "STATUS_CHANGED",
        "Status changed to OFFER",
        "Status changed from INTERVIEW to OFFER",
        undefined,
      );

      expect(createJobActivity).toHaveBeenNthCalledWith(
        2,
        jobId,
        "OFFER",
        "Offer Received",
        "Congratulations! An offer has been received.",
        undefined,
      );

      expect(createJobActivity).toHaveBeenCalledTimes(2);
    });

    it("creates a rejected activity when status changes to REJECTED", async () => {
      vi.mocked(createJobActivity).mockResolvedValue({} as never);

      await handleStatusChangeActivity(jobId, "INTERVIEW", "REJECTED");

      expect(createJobActivity).toHaveBeenNthCalledWith(
        1,
        jobId,
        "STATUS_CHANGED",
        "Status changed to REJECTED",
        "Status changed from INTERVIEW to REJECTED",
        undefined,
      );

      expect(createJobActivity).toHaveBeenNthCalledWith(
        2,
        jobId,
        "REJECTED",
        "Application Rejected",
        "Application moved to the rejected stage.",
        undefined,
      );

      expect(createJobActivity).toHaveBeenCalledTimes(2);
    });

    it("does not create a secondary activity for statuses without special handling", async () => {
      vi.mocked(createJobActivity).mockResolvedValue({} as never);

      await handleStatusChangeActivity(jobId, "APPLIED", "SCREENING");

      expect(createJobActivity).toHaveBeenCalledTimes(1);
    });
  });

  describe("getJobActivities", () => {
    it("gets activities for the specified user and job", async () => {
      const activities = [
        {
          id: "activity-1",
          jobId,
          type: "CREATED",
          title: "Added Acme Corp",
        },
      ];

      vi.mocked(getActivitiesByJobId).mockResolvedValue(activities as never);

      const result = await getJobActivities(userId, jobId);

      expect(getActivitiesByJobId).toHaveBeenCalledWith(userId, jobId);
      expect(result).toBe(activities);
    });
  });
});
