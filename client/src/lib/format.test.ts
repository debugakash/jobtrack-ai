import { describe, expect, it } from "vitest";

import { formatEnum } from "./format";

describe("formatEnum", () => {
  it("formats a single uppercase word", () => {
    expect(formatEnum("PENDING")).toBe("Pending");
  });

  it("formats an underscore-separated enum", () => {
    expect(formatEnum("IN_PROGRESS")).toBe("In Progress");
  });

  it("formats multiple underscore-separated words", () => {
    expect(formatEnum("SCHEDULED_INTERVIEW_ROUND")).toBe(
      "Scheduled Interview Round",
    );
  });

  it("handles an already lowercase value", () => {
    expect(formatEnum("rejected")).toBe("Rejected");
  });
});
