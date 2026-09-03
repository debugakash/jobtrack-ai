import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import { updateResume } from "./update-resume";

vi.mock("@/lib/api", () => ({
  api: {
    patch: vi.fn(),
  },
}));

describe("updateResume", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates the resume with the provided data", async () => {
    const resumeId = "resume-123";

    const updateData = {
      label: "Updated Resume",
      isDefault: true,
    };

    vi.mocked(api.patch).mockResolvedValueOnce({
      data: {
        data: {
          id: resumeId,
          ...updateData,
        },
      },
    } as never);

    await updateResume(resumeId, updateData);

    expect(api.patch).toHaveBeenCalledWith(`/resumes/${resumeId}`, updateData);
  });

  it("returns the updated resume from the API response", async () => {
    const resumeId = "resume-456";

    const updateData = {
      label: "Backend Resume",
      isDefault: false,
    };

    const updatedResume = {
      id: resumeId,
      ...updateData,
    };

    vi.mocked(api.patch).mockResolvedValueOnce({
      data: {
        data: updatedResume,
      },
    } as never);

    const result = await updateResume(resumeId, updateData);

    expect(result).toEqual(updatedResume);
  });
});
