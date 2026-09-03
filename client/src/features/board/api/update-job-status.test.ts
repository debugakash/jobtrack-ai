import { describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import { updateJobStatus } from "./update-job-status";

describe("updateJobStatus", () => {
  it("updates the job status with the correct job ID and status", async () => {
    const patchSpy = vi.spyOn(api, "patch").mockResolvedValue({
      data: {
        data: {},
      },
    } as never);

    await updateJobStatus("job-123", "INTERVIEW");

    expect(patchSpy).toHaveBeenCalledWith("/jobs/job-123", {
      status: "INTERVIEW",
    });
  });

  it("returns the updated job data from the API response", async () => {
    const updatedJob = {
      id: "job-123",
      status: "INTERVIEW",
    };

    vi.spyOn(api, "patch").mockResolvedValue({
      data: {
        data: updatedJob,
      },
    } as never);

    const result = await updateJobStatus("job-123", "INTERVIEW");

    expect(result).toEqual(updatedJob);
  });
});
