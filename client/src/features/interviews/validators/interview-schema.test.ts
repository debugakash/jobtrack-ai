import { describe, expect, it } from "vitest";

import { interviewSchema } from "./interview-schema";

describe("interviewSchema", () => {
  const validInterview = {
    round: "Technical Interview",
    scheduledAt: "2026-09-10T10:00",
  };

  it("accepts a valid interview", () => {
    const result = interviewSchema.safeParse(validInterview);

    expect(result.success).toBe(true);
  });

  it("accepts an interview with optional fields", () => {
    const result = interviewSchema.safeParse({
      ...validInterview,
      interviewerName: "John Doe",
      meetingLink: "https://meet.example.com/interview",
      notes: "Prepare system design questions",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty round", () => {
    const result = interviewSchema.safeParse({
      ...validInterview,
      round: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Round is required");
    }
  });

  it("rejects an empty scheduled date", () => {
    const result = interviewSchema.safeParse({
      ...validInterview,
      scheduledAt: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Date is required");
    }
  });

  it("rejects an invalid meeting link", () => {
    const result = interviewSchema.safeParse({
      ...validInterview,
      meetingLink: "not-a-valid-url",
    });

    expect(result.success).toBe(false);
  });

  it("accepts an empty meeting link", () => {
    const result = interviewSchema.safeParse({
      ...validInterview,
      meetingLink: "",
    });

    expect(result.success).toBe(true);
  });
});
