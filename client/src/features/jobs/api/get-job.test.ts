import { describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import { getJob } from "./get-job";

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("getJob", () => {
  it("sends a GET request for the specified job", async () => {
    const job = {
      id: "job-123",
      company: "Google",
      jobTitle: "Frontend Developer",
    };

    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        data: job,
      },
    } as never);

    const result = await getJob("job-123");

    expect(api.get).toHaveBeenCalledWith("/jobs/job-123");
    expect(result).toEqual(job);
  });

  it("returns only the job data from the API response", async () => {
    const job = {
      id: "job-456",
      company: "Microsoft",
      jobTitle: "React Developer",
    };

    const responseData = {
      success: true,
      data: job,
    };

    vi.mocked(api.get).mockResolvedValueOnce({
      data: responseData,
    } as never);

    const result = await getJob("job-456");

    expect(result).toEqual(job);
    expect(result).not.toEqual(responseData);
  });
});
