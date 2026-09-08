import { describe, expect, it } from "vitest";
import { createResumeSchema, updateResumeSchema } from "./resume.validator.js";

describe("resume validators", () => {
  describe("createResumeSchema", () => {
    it("accepts valid resume data", () => {
      const result = createResumeSchema.safeParse({
        label: "Frontend Developer Resume",
        isDefault: true,
      });

      expect(result.success).toBe(true);
    });

    it("accepts an empty object", () => {
      const result = createResumeSchema.safeParse({});

      expect(result.success).toBe(true);
    });

    it("trims the resume label", () => {
      const result = createResumeSchema.safeParse({
        label: "  Frontend Resume  ",
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.label).toBe("Frontend Resume");
      }
    });

    it("rejects a label longer than 100 characters", () => {
      const result = createResumeSchema.safeParse({
        label: "a".repeat(101),
      });

      expect(result.success).toBe(false);
    });

    it("coerces a string boolean to a boolean", () => {
      const result = createResumeSchema.safeParse({
        isDefault: "true",
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.isDefault).toBe(true);
      }
    });

    it("coerces a non-empty string to true", () => {
      const result = createResumeSchema.safeParse({
        isDefault: "false",
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.isDefault).toBe(true);
      }
    });
  });

  describe("updateResumeSchema", () => {
    it("accepts a partial update", () => {
      const result = updateResumeSchema.safeParse({
        label: "Updated Resume",
      });

      expect(result.success).toBe(true);
    });

    it("accepts updating the default status", () => {
      const result = updateResumeSchema.safeParse({
        isDefault: true,
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.isDefault).toBe(true);
      }
    });

    it("rejects a label longer than 100 characters", () => {
      const result = updateResumeSchema.safeParse({
        label: "a".repeat(101),
      });

      expect(result.success).toBe(false);
    });
  });
});
