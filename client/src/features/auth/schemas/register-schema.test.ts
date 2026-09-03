import { describe, expect, it } from "vitest";

import { registerSchema } from "./register-schema";

describe("registerSchema", () => {
  const validData = {
    firstName: "Akash",
    lastName: "Arya",
    email: "akash@example.com",
    password: "password123",
    confirmPassword: "password123",
  };

  it("accepts valid registration data", () => {
    const result = registerSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it("rejects first name shorter than 2 characters", () => {
    const result = registerSchema.safeParse({
      ...validData,
      firstName: "A",
    });

    expect(result.success).toBe(false);
  });

  it("rejects last name shorter than 2 characters", () => {
    const result = registerSchema.safeParse({
      ...validData,
      lastName: "A",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({
      ...validData,
      email: "invalid-email",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "1234567",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Password must be at least 8 characters",
      );
    }
  });

  it("rejects when passwords do not match", () => {
    const result = registerSchema.safeParse({
      ...validData,
      confirmPassword: "different123",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Passwords do not match");
      expect(result.error.issues[0].path).toEqual(["confirmPassword"]);
    }
  });
});
