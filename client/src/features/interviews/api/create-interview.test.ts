import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import type { InterviewFormValues } from "../validators/interview-schema";

import { createInterview } from "./create-interview";

vi.mock("@/lib/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

describe("createInterview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates an interview for the specified job", async () => {
    const jobId = "job-123";

    const interviewData: InterviewFormValues = {
      round: "Technical Interview",
      scheduledAt: "2026-09-10T10:00:00.000Z",
      interviewerName: "John Doe",
      meetingLink: "https://meet.example.com/interview",
      notes: "Technical interview with the engineering team",
    };

    const responseData = {
      id: "interview-123",
      jobId,
      ...interviewData,
    };

    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        data: responseData,
      },
    } as never);

    const result = await createInterview(jobId, interviewData);

    expect(api.post).toHaveBeenCalledWith(
      `/jobs/${jobId}/interviews`,
      interviewData,
    );

    expect(result).toEqual(responseData);
  });

  it("returns the interview data from the API response", async () => {
    const jobId = "job-456";

    const interviewData: InterviewFormValues = {
      round: "HR Interview",
      scheduledAt: "2026-09-12T14:00:00.000Z",
    };

    const responseData = {
      id: "interview-456",
      jobId,
      ...interviewData,
    };

    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        data: responseData,
      },
    } as never);

    const result = await createInterview(jobId, interviewData);

    expect(api.post).toHaveBeenCalledWith(
      `/jobs/${jobId}/interviews`,
      interviewData,
    );

    expect(result).toEqual(responseData);
  });
});
