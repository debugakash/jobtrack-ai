import { describe, expect, it } from "vitest";

import { jobSchema } from "./job-schema";

describe("jobSchema", () => {
  const validJob = {
    company: "Acme Corp",
    jobTitle: "Full Stack Developer",
    jobType: "FULL_TIME" as const,
    workMode: "REMOTE" as const,
    status: "APPLIED" as const,
  };

  it("accepts a valid job", () => {
    const result = jobSchema.safeParse(validJob);

    expect(result.success).toBe(true);
  });

  it("accepts a job with optional fields", () => {
    const result = jobSchema.safeParse({
      ...validJob,
      description: "Build web applications",
      location: "Remote",
      salaryMin: 50000,
      salaryMax: 80000,
      source: "LINKEDIN",
      jobUrl: "https://example.com/job",
      notes: "Follow up next week",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty company", () => {
    const result = jobSchema.safeParse({
      ...validJob,
      company: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Company is required");
    }
  });

  it("rejects an empty job title", () => {
    const result = jobSchema.safeParse({
      ...validJob,
      jobTitle: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Job title is required");
    }
  });

  it("rejects an invalid job URL", () => {
    const result = jobSchema.safeParse({
      ...validJob,
      jobUrl: "not-a-valid-url",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Enter a valid URL");
    }
  });

  it("accepts an empty job URL", () => {
    const result = jobSchema.safeParse({
      ...validJob,
      jobUrl: "",
    });

    expect(result.success).toBe(true);
  });

  it("rejects negative salary values", () => {
    const result = jobSchema.safeParse({
      ...validJob,
      salaryMin: -1000,
    });

    expect(result.success).toBe(false);
  });

  it("rejects non-integer salary values", () => {
    const result = jobSchema.safeParse({
      ...validJob,
      salaryMax: 75000.5,
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid enum values", () => {
    const result = jobSchema.safeParse({
      ...validJob,
      jobType: "INVALID_TYPE",
    });

    expect(result.success).toBe(false);
  });
});
