import { describe, expect, it, vi } from "vitest";

import {
  invalidateCalendarInterviews,
  invalidateDashboard,
  invalidateJob,
  invalidateJobInterviews,
  invalidateJobs,
  invalidateNotifications,
} from "./query-invalidations";

describe("query invalidation utilities", () => {
  it("invalidates notifications", () => {
    const queryClient = {
      invalidateQueries: vi.fn(),
    };

    invalidateNotifications(queryClient as never);

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["notifications"],
    });
  });

  it("invalidates dashboard queries", () => {
    const queryClient = {
      invalidateQueries: vi.fn(),
    };

    invalidateDashboard(queryClient as never);

    expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(2);

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["dashboard-stats"],
    });

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["dashboard-upcoming-interviews"],
    });
  });

  it("invalidates jobs", () => {
    const queryClient = {
      invalidateQueries: vi.fn(),
    };

    invalidateJobs(queryClient as never);

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["jobs"],
    });
  });

  it("invalidates a specific job", () => {
    const queryClient = {
      invalidateQueries: vi.fn(),
    };

    invalidateJob(queryClient as never, "job-123");

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["job", "job-123"],
    });
  });

  it("invalidates interviews for a specific job", () => {
    const queryClient = {
      invalidateQueries: vi.fn(),
    };

    invalidateJobInterviews(queryClient as never, "job-123");

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["interviews", "job-123"],
    });
  });

  it("invalidates calendar interviews", () => {
    const queryClient = {
      invalidateQueries: vi.fn(),
    };

    invalidateCalendarInterviews(queryClient as never);

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["calendar-interviews"],
    });
  });
});
