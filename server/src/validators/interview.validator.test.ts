import { describe, expect, it } from "vitest";
import {
  createInterviewSchema,
  updateInterviewSchema,
} from "./interview.validator.js";

describe("interview validators", () => {
  describe("createInterviewSchema", () => {
    it("accepts valid interview data", () => {
      const result = createInterviewSchema.safeParse({
        round: "Technical Interview",
        scheduledAt: "2026-09-15T10:00:00Z",
        interviewerName: "John Doe",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        notes: "Prepare React and TypeScript questions",
      });

      expect(result.success).toBe(true);
    });

    it("accepts an interview with only required fields", () => {
      const result = createInterviewSchema.safeParse({
        round: "HR Interview",
        scheduledAt: "2026-09-15T10:00:00Z",
      });

      expect(result.success).toBe(true);
    });

    it("coerces scheduledAt into a Date", () => {
      const result = createInterviewSchema.safeParse({
        round: "Technical Interview",
        scheduledAt: "2026-09-15T10:00:00Z",
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.scheduledAt).toBeInstanceOf(Date);
      }
    });

    it("rejects an empty round", () => {
      const result = createInterviewSchema.safeParse({
        round: "",
        scheduledAt: "2026-09-15T10:00:00Z",
      });

      expect(result.success).toBe(false);
    });

    it("rejects an invalid scheduledAt value", () => {
      const result = createInterviewSchema.safeParse({
        round: "Technical Interview",
        scheduledAt: "not-a-date",
      });

      expect(result.success).toBe(false);
    });

    it("rejects an invalid meeting link", () => {
      const result = createInterviewSchema.safeParse({
        round: "Technical Interview",
        scheduledAt: "2026-09-15T10:00:00Z",
        meetingLink: "not-a-url",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("updateInterviewSchema", () => {
    it("accepts a partial update", () => {
      const result = updateInterviewSchema.safeParse({
        round: "Final Interview",
      });

      expect(result.success).toBe(true);
    });

    it("accepts completed status", () => {
      const result = updateInterviewSchema.safeParse({
        completed: true,
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.completed).toBe(true);
      }
    });

    it("accepts completed as false", () => {
      const result = updateInterviewSchema.safeParse({
        completed: false,
      });

      expect(result.success).toBe(true);
    });

    it("accepts an updated scheduled date", () => {
      const result = updateInterviewSchema.safeParse({
        scheduledAt: "2026-09-20T14:30:00Z",
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.scheduledAt).toBeInstanceOf(Date);
      }
    });

    it("rejects an invalid meeting link during update", () => {
      const result = updateInterviewSchema.safeParse({
        meetingLink: "invalid-url",
      });

      expect(result.success).toBe(false);
    });
  });
});
