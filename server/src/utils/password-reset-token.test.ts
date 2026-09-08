import { describe, expect, it } from "vitest";
import {
  generatePasswordResetToken,
  hashPasswordResetToken,
} from "./password-reset-token.js";

describe("password reset token utilities", () => {
  describe("generatePasswordResetToken", () => {
    it("generates a token", () => {
      const token = generatePasswordResetToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });

    it("generates a 64-character hexadecimal token", () => {
      const token = generatePasswordResetToken();

      expect(token).toHaveLength(64);
      expect(token).toMatch(/^[a-f0-9]+$/);
    });

    it("generates unique tokens", () => {
      const firstToken = generatePasswordResetToken();
      const secondToken = generatePasswordResetToken();

      expect(firstToken).not.toBe(secondToken);
    });
  });

  describe("hashPasswordResetToken", () => {
    it("returns a SHA-256 hexadecimal hash", () => {
      const hash = hashPasswordResetToken("test-token");

      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[a-f0-9]+$/);
    });

    it("returns the same hash for the same token", () => {
      const firstHash = hashPasswordResetToken("test-token");
      const secondHash = hashPasswordResetToken("test-token");

      expect(firstHash).toBe(secondHash);
    });

    it("returns different hashes for different tokens", () => {
      const firstHash = hashPasswordResetToken("test-token-1");
      const secondHash = hashPasswordResetToken("test-token-2");

      expect(firstHash).not.toBe(secondHash);
    });

    it("hashes the raw token rather than returning it unchanged", () => {
      const token = "my-reset-token";
      const hash = hashPasswordResetToken(token);

      expect(hash).not.toBe(token);
    });
  });
});
