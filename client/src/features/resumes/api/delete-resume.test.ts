import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import { deleteResume } from "./delete-resume";

vi.mock("@/lib/api", () => ({
  api: {
    delete: vi.fn(),
  },
}));

describe("deleteResume", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes the specified resume", async () => {
    const resumeId = "resume-123";

    vi.mocked(api.delete).mockResolvedValueOnce({} as never);

    await deleteResume(resumeId);

    expect(api.delete).toHaveBeenCalledWith(`/resumes/${resumeId}`);
  });

  it("returns undefined after deleting the resume", async () => {
    const resumeId = "resume-456";

    vi.mocked(api.delete).mockResolvedValueOnce({} as never);

    const result = await deleteResume(resumeId);

    expect(api.delete).toHaveBeenCalledWith(`/resumes/${resumeId}`);
    expect(result).toBeUndefined();
  });
});
