import { describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import type { CreateJobRequest } from "../types/job";

import { createJob } from "./create-job";

vi.mock("@/lib/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

describe("createJob", () => {
  it("sends a POST request with the job data", async () => {
    const jobData: CreateJobRequest = {
      company: "Google",
      jobTitle: "Frontend Developer",
      jobType: "FULL_TIME",
      workMode: "REMOTE",
      status: "APPLIED",
    };

    const responseData = {
      success: true,
      data: {
        id: "job-123",
        ...jobData,
      },
    };

    vi.mocked(api.post).mockResolvedValueOnce({
      data: responseData,
    } as never);

    const result = await createJob(jobData);

    expect(api.post).toHaveBeenCalledWith("/jobs", jobData);
    expect(result).toEqual(responseData);
  });

  it("returns the complete API response data", async () => {
    const jobData: CreateJobRequest = {
      company: "Microsoft",
      jobTitle: "React Developer",
      jobType: "FULL_TIME",
      workMode: "HYBRID",
      status: "APPLIED",
    };

    const responseData = {
      success: true,
      data: {
        id: "job-456",
        ...jobData,
      },
    };

    vi.mocked(api.post).mockResolvedValueOnce({
      data: responseData,
    } as never);

    const result = await createJob(jobData);

    expect(result).toEqual(responseData);
  });
});
