import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import type { JobFormValues } from "../validators/job-schema";

import { updateJob } from "./update-job";

vi.mock("@/lib/api", () => ({
  api: {
    patch: vi.fn(),
  },
}));

describe("updateJob", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates a job with the provided data", async () => {
    const jobId = "job-123";

    const jobData: JobFormValues = {
      company: "Google",
      jobTitle: "Frontend Developer",
      location: "Remote",
      jobType: "FULL_TIME",
      workMode: "REMOTE",
      status: "INTERVIEW",
    };

    const responseData = {
      success: true,
      data: {
        id: jobId,
        ...jobData,
      },
    };

    vi.mocked(api.patch).mockResolvedValueOnce({
      data: responseData,
    } as never);

    const result = await updateJob(jobId, jobData);

    expect(api.patch).toHaveBeenCalledWith(`/jobs/${jobId}`, jobData);

    expect(result).toEqual(responseData);
  });

  it("returns the API response data", async () => {
    const jobId = "job-456";

    const jobData: JobFormValues = {
      company: "Microsoft",
      jobTitle: "React Developer",
      jobType: "FULL_TIME",
      workMode: "HYBRID",
      status: "APPLIED",
    };

    const responseData = {
      success: true,
      data: {
        id: jobId,
        ...jobData,
      },
    };

    vi.mocked(api.patch).mockResolvedValueOnce({
      data: responseData,
    } as never);

    const result = await updateJob(jobId, jobData);

    expect(api.patch).toHaveBeenCalledWith(`/jobs/${jobId}`, jobData);
    expect(result).toEqual(responseData);
  });
});
