import { describe, expect, it } from "vitest";

import { resetPasswordSchema } from "./reset-password-schema";

describe("resetPasswordSchema", () => {
  it("accepts matching valid passwords", () => {
    const result = resetPasswordSchema.safeParse({
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = resetPasswordSchema.safeParse({
      password: "1234567",
      confirmPassword: "1234567",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Password must be at least 8 characters long",
      );
    }
  });

  it("rejects when passwords do not match", () => {
    const result = resetPasswordSchema.safeParse({
      password: "password123",
      confirmPassword: "different123",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Passwords do not match");
      expect(result.error.issues[0].path).toEqual(["confirmPassword"]);
    }
  });
});
