import { describe, expect, it } from "vitest";

import { forgotPasswordSchema } from "./forgot-password-schema";

describe("forgotPasswordSchema", () => {
  it("accepts a valid email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "test@example.com",
    });

    expect(result.success).toBe(true);
  });

  it("trims whitespace from the email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "  test@example.com  ",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("test@example.com");
    }
  });

  it("rejects an invalid email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "invalid-email",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Please enter a valid email address",
      );
    }
  });
});
