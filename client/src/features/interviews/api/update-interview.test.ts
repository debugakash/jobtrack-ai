import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import type { InterviewFormValues } from "../validators/interview-schema";

import { updateInterview } from "./update-interview";

vi.mock("@/lib/api", () => ({
  api: {
    patch: vi.fn(),
  },
}));

describe("updateInterview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates an interview with the provided data", async () => {
    const interviewId = "interview-123";

    const interviewData: Partial<InterviewFormValues> & {
      completed?: boolean;
    } = {
      round: "Technical Interview",
      scheduledAt: "2026-09-15T10:00:00.000Z",
      interviewerName: "John Doe",
      meetingLink: "https://meet.example.com/interview",
      notes: "Updated interview details",
      completed: false,
    };

    const responseData = {
      id: interviewId,
      ...interviewData,
    };

    vi.mocked(api.patch).mockResolvedValueOnce({
      data: {
        data: responseData,
      },
    } as never);

    const result = await updateInterview(interviewId, interviewData);

    expect(api.patch).toHaveBeenCalledWith(
      `/interviews/${interviewId}`,
      interviewData,
    );

    expect(result).toEqual(responseData);
  });

  it("supports partial updates", async () => {
    const interviewId = "interview-456";

    const interviewData: Partial<InterviewFormValues> & {
      completed?: boolean;
    } = {
      completed: true,
    };

    const responseData = {
      id: interviewId,
      completed: true,
    };

    vi.mocked(api.patch).mockResolvedValueOnce({
      data: {
        data: responseData,
      },
    } as never);

    const result = await updateInterview(interviewId, interviewData);

    expect(api.patch).toHaveBeenCalledWith(
      `/interviews/${interviewId}`,
      interviewData,
    );

    expect(result).toEqual(responseData);
  });
});
