import { describe, expect, it } from "vitest";

import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.validator.js";

describe("auth validators", () => {
  describe("registerSchema", () => {
    it("accepts valid registration data", () => {
      const result = registerSchema.safeParse({
        firstName: "Akash",
        lastName: "Arya",
        email: "akash@example.com",
        password: "password123",
      });

      expect(result.success).toBe(true);
    });

    it("rejects invalid registration data", () => {
      const result = registerSchema.safeParse({
        firstName: "A",
        lastName: "A",
        email: "invalid-email",
        password: "123",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("loginSchema", () => {
    it("accepts valid login data", () => {
      const result = loginSchema.safeParse({
        email: "akash@example.com",
        password: "password123",
      });

      expect(result.success).toBe(true);
    });

    it("rejects an invalid email", () => {
      const result = loginSchema.safeParse({
        email: "invalid-email",
        password: "password123",
      });

      expect(result.success).toBe(false);
    });

    it("rejects a password shorter than 8 characters", () => {
      const result = loginSchema.safeParse({
        email: "akash@example.com",
        password: "1234567",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("changePasswordSchema", () => {
    it("accepts different valid passwords", () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: "oldpassword",
        newPassword: "newpassword",
      });

      expect(result.success).toBe(true);
    });

    it("rejects when the new password matches the current password", () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: "samepassword",
        newPassword: "samepassword",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "New password must be different from current password",
        );
      }
    });
  });

  describe("forgotPasswordSchema", () => {
    it("accepts a valid email", () => {
      const result = forgotPasswordSchema.safeParse({
        email: "akash@example.com",
      });

      expect(result.success).toBe(true);
    });

    it("rejects an invalid email", () => {
      const result = forgotPasswordSchema.safeParse({
        email: "invalid-email",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("resetPasswordSchema", () => {
    it("accepts a valid reset token and password", () => {
      const result = resetPasswordSchema.safeParse({
        token: "reset-token-123",
        newPassword: "newpassword123",
      });

      expect(result.success).toBe(true);
    });

    it("rejects an empty reset token", () => {
      const result = resetPasswordSchema.safeParse({
        token: "",
        newPassword: "newpassword123",
      });

      expect(result.success).toBe(false);
    });

    it("rejects a password shorter than 8 characters", () => {
      const result = resetPasswordSchema.safeParse({
        token: "reset-token-123",
        newPassword: "1234567",
      });

      expect(result.success).toBe(false);
    });
  });
});
