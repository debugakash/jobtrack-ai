import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import { getResumes } from "./get-resumes";

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("getResumes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches resumes from the resumes endpoint", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        data: [],
      },
    } as never);

    await getResumes();

    expect(api.get).toHaveBeenCalledWith("/resumes");
  });

  it("returns the resumes from the API response", async () => {
    const resumes = [
      {
        id: "resume-123",
        name: "Frontend Resume",
      },
      {
        id: "resume-456",
        name: "Full Stack Resume",
      },
    ];

    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        data: resumes,
      },
    } as never);

    const result = await getResumes();

    expect(result).toEqual(resumes);
  });
});
