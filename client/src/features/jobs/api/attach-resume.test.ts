import { describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import { attachResume } from "./attach-resume";

vi.mock("@/lib/api", () => ({
  api: {
    patch: vi.fn(),
  },
}));

describe("attachResume", () => {
  it("attaches a resume to a job", async () => {
    const updatedJob = {
      id: "job-123",
      resumeId: "resume-456",
    };

    vi.mocked(api.patch).mockResolvedValueOnce({
      data: {
        data: updatedJob,
      },
    } as never);

    const result = await attachResume("job-123", "resume-456");

    expect(api.patch).toHaveBeenCalledWith("/jobs/job-123", {
      resumeId: "resume-456",
    });

    expect(result).toEqual(updatedJob);
  });

  it("removes the attached resume when resumeId is null", async () => {
    const updatedJob = {
      id: "job-123",
      resumeId: null,
    };

    vi.mocked(api.patch).mockResolvedValueOnce({
      data: {
        data: updatedJob,
      },
    } as never);

    const result = await attachResume("job-123", null);

    expect(api.patch).toHaveBeenCalledWith("/jobs/job-123", {
      resumeId: null,
    });

    expect(result).toEqual(updatedJob);
  });
});
