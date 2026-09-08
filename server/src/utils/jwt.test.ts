import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../config/env.js", () => ({
  env: {
    JWT_SECRET: "test-jwt-secret",
    JWT_EXPIRES_IN: "7d",
  },
}));

import { generateAccessToken, verifyAccessToken } from "./jwt.js";

describe("JWT utilities", () => {
  const payload = {
    userId: "user-123",
    email: "test@example.com",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateAccessToken", () => {
    it("generates a JWT token", () => {
      const token = generateAccessToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });

    it("generates a token that can be verified", () => {
      const token = generateAccessToken(payload);

      const decoded = verifyAccessToken(token);

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
    });
  });

  describe("verifyAccessToken", () => {
    it("returns the original payload for a valid token", () => {
      const token = generateAccessToken(payload);

      const decoded = verifyAccessToken(token);

      expect(decoded).toMatchObject(payload);
    });

    it("rejects an invalid token", () => {
      expect(() => {
        verifyAccessToken("invalid-token");
      }).toThrow();
    });

    it("rejects a token signed with a different secret", async () => {
      const jsonwebtoken = await import("jsonwebtoken");

      const token = jsonwebtoken.default.sign(payload, "different-secret", {
        expiresIn: "7d",
      });

      expect(() => {
        verifyAccessToken(token);
      }).toThrow();
    });

    it("rejects a malformed token", () => {
      expect(() => {
        verifyAccessToken("header.payload.signature");
      }).toThrow();
    });
  });
});
