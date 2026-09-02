import { describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";

import { analyzeJob } from "./analyze-job";

vi.mock("@/lib/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

describe("analyzeJob", () => {
  it("sends a POST request to analyze the job", async () => {
    const analysisResult = {
      score: 85,
      strengths: ["React", "TypeScript"],
      weaknesses: ["Testing"],
    };

    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        data: analysisResult,
      },
    } as never);

    const result = await analyzeJob("job-123");

    expect(api.post).toHaveBeenCalledWith("/ai/jobs/job-123/analyze");
    expect(result).toEqual(analysisResult);
  });

  it("returns the analysis data from the API response", async () => {
    const analysisResult = {
      score: 92,
      strengths: ["React", "Node.js"],
      weaknesses: [],
    };

    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        data: analysisResult,
      },
    } as never);

    const result = await analyzeJob("job-456");

    expect(result).toEqual(analysisResult);
  });
});
