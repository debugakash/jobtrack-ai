import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import type { Interview } from "../types/interview";

import { getAllInterviews } from "./get-all-interviews";

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("getAllInterviews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches all interviews", async () => {
    const interviews: Interview[] = [
      {
        id: "interview-1",
        jobId: "job-123",
        round: "Technical Interview",
        scheduledAt: "2026-09-10T10:00:00.000Z",
        interviewerName: "John Doe",
        meetingLink: "https://meet.example.com/interview-1",
        notes: "Technical round",
        completed: false,
        createdAt: "2026-09-01T10:00:00.000Z",
        updatedAt: "2026-09-01T10:00:00.000Z",
        job: {
          id: "job-123",
          company: "Google",
          jobTitle: "Frontend Developer",
          status: "INTERVIEW",
        },
      },
      {
        id: "interview-2",
        jobId: "job-456",
        round: "HR Interview",
        scheduledAt: "2026-09-12T14:00:00.000Z",
        interviewerName: "Jane Smith",
        meetingLink: "https://meet.example.com/interview-2",
        notes: "HR discussion",
        completed: true,
        createdAt: "2026-09-02T09:00:00.000Z",
        updatedAt: "2026-09-02T09:00:00.000Z",
        job: {
          id: "job-456",
          company: "Microsoft",
          jobTitle: "React Developer",
          status: "APPLIED",
        },
      },
    ];

    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        data: interviews,
      },
    } as never);

    const result = await getAllInterviews();

    expect(api.get).toHaveBeenCalledWith("/interviews");
    expect(result).toEqual(interviews);
  });

  it("returns an empty array when there are no interviews", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        data: [],
      },
    } as never);

    const result = await getAllInterviews();

    expect(api.get).toHaveBeenCalledWith("/interviews");
    expect(result).toEqual([]);
  });
});
