import { describe, expect, it } from "vitest";
import {
  createJobSchema,
  updateJobSchema,
  getJobsQuerySchema,
} from "./job.validator.js";

describe("job validators", () => {
  describe("createJobSchema", () => {
    it("accepts valid job data", () => {
      const result = createJobSchema.safeParse({
        company: "Google",
        jobTitle: "Frontend Developer",
        description: "Build React applications",
        location: "Bangalore",
        jobType: "FULL_TIME",
        workMode: "REMOTE",
        status: "APPLIED",
        salaryMin: 800000,
        salaryMax: 1200000,
        source: "LINKEDIN",
        jobUrl: "https://www.linkedin.com/jobs/view/123",
        notes: "Follow up next week",
        followUpDate: "2026-09-10",
        followUpDone: false,
      });

      expect(result.success).toBe(true);
    });

    it("accepts a job with only required fields", () => {
      const result = createJobSchema.safeParse({
        company: "Microsoft",
        jobTitle: "Software Engineer",
        jobType: "FULL_TIME",
        workMode: "HYBRID",
      });

      expect(result.success).toBe(true);
    });

    it("rejects when company is empty", () => {
      const result = createJobSchema.safeParse({
        company: "",
        jobTitle: "Frontend Developer",
        jobType: "FULL_TIME",
        workMode: "REMOTE",
      });

      expect(result.success).toBe(false);
    });

    it("rejects when job title is empty", () => {
      const result = createJobSchema.safeParse({
        company: "Google",
        jobTitle: "",
        jobType: "FULL_TIME",
        workMode: "REMOTE",
      });

      expect(result.success).toBe(false);
    });

    it("rejects an invalid job type", () => {
      const result = createJobSchema.safeParse({
        company: "Google",
        jobTitle: "Frontend Developer",
        jobType: "INVALID",
        workMode: "REMOTE",
      });

      expect(result.success).toBe(false);
    });

    it("rejects an invalid work mode", () => {
      const result = createJobSchema.safeParse({
        company: "Google",
        jobTitle: "Frontend Developer",
        jobType: "FULL_TIME",
        workMode: "INVALID",
      });

      expect(result.success).toBe(false);
    });

    it("rejects an invalid job status", () => {
      const result = createJobSchema.safeParse({
        company: "Google",
        jobTitle: "Frontend Developer",
        jobType: "FULL_TIME",
        workMode: "REMOTE",
        status: "INVALID",
      });

      expect(result.success).toBe(false);
    });

    it("rejects an invalid job URL", () => {
      const result = createJobSchema.safeParse({
        company: "Google",
        jobTitle: "Frontend Developer",
        jobType: "FULL_TIME",
        workMode: "REMOTE",
        jobUrl: "not-a-url",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("updateJobSchema", () => {
    it("accepts a partial update", () => {
      const result = updateJobSchema.safeParse({
        status: "INTERVIEW",
      });

      expect(result.success).toBe(true);
    });

    it("accepts an update containing only company", () => {
      const result = updateJobSchema.safeParse({
        company: "Amazon",
      });

      expect(result.success).toBe(true);
    });

    it("accepts null resumeId to remove an attached resume", () => {
      const result = updateJobSchema.safeParse({
        resumeId: null,
      });

      expect(result.success).toBe(true);
    });

    it("rejects invalid values in a partial update", () => {
      const result = updateJobSchema.safeParse({
        workMode: "INVALID",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("getJobsQuerySchema", () => {
    it("accepts valid query parameters", () => {
      const result = getJobsQuerySchema.safeParse({
        search: "frontend",
        status: "APPLIED",
        jobType: "FULL_TIME",
        workMode: "REMOTE",
        sort: "newest",
        page: "2",
        limit: "20",
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.page).toBe(2);
        expect(result.data.limit).toBe(20);
      }
    });

    it("uses default page and limit", () => {
      const result = getJobsQuerySchema.safeParse({});

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
      }
    });

    it("rejects an invalid sort value", () => {
      const result = getJobsQuerySchema.safeParse({
        sort: "invalid",
      });

      expect(result.success).toBe(false);
    });

    it("rejects page zero", () => {
      const result = getJobsQuerySchema.safeParse({
        page: "0",
      });

      expect(result.success).toBe(false);
    });

    it("rejects a limit greater than 100", () => {
      const result = getJobsQuerySchema.safeParse({
        limit: "101",
      });

      expect(result.success).toBe(false);
    });

    it("trims the search query", () => {
      const result = getJobsQuerySchema.safeParse({
        search: "  frontend developer  ",
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.search).toBe("frontend developer");
      }
    });
  });
});
