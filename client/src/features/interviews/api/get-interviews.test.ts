import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import type { Interview } from "../types/interview";

import { getInterviews } from "./get-interviews";

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("getInterviews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches interviews for the specified job", async () => {
    const jobId = "job-123";

    const interviews: Interview[] = [
      {
        id: "interview-1",
        jobId,
        round: "Technical Interview",
        scheduledAt: "2026-09-10T10:00:00.000Z",
        interviewerName: "John Doe",
        meetingLink: "https://meet.example.com/interview-1",
        notes: "Technical round",
        completed: false,
        createdAt: "2026-09-01T10:00:00.000Z",
        updatedAt: "2026-09-01T10:00:00.000Z",
        job: {
          id: jobId,
          company: "Google",
          jobTitle: "Frontend Developer",
          status: "INTERVIEW",
        },
      },
      {
        id: "interview-2",
        jobId,
        round: "HR Interview",
        scheduledAt: "2026-09-12T14:00:00.000Z",
        interviewerName: "Jane Smith",
        meetingLink: "https://meet.example.com/interview-2",
        notes: "HR discussion",
        completed: true,
        createdAt: "2026-09-02T09:00:00.000Z",
        updatedAt: "2026-09-02T09:00:00.000Z",
        job: {
          id: jobId,
          company: "Google",
          jobTitle: "Frontend Developer",
          status: "INTERVIEW",
        },
      },
    ];

    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        data: interviews,
      },
    } as never);

    const result = await getInterviews(jobId);

    expect(api.get).toHaveBeenCalledWith(`/jobs/${jobId}/interviews`);
    expect(result).toEqual(interviews);
  });

  it("returns an empty array when the job has no interviews", async () => {
    const jobId = "job-456";

    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        data: [],
      },
    } as never);

    const result = await getInterviews(jobId);

    expect(api.get).toHaveBeenCalledWith(`/jobs/${jobId}/interviews`);
    expect(result).toEqual([]);
  });
});
