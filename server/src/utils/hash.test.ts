import { describe, expect, it } from "vitest";
import { hashPassword, comparePasswords } from "./hash.js";

describe("password hash utilities", () => {
  describe("hashPassword", () => {
    it("returns a hashed password", async () => {
      const password = "SecurePassword123!";

      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe("string");
      expect(hash).not.toBe(password);
    });

    it("generates different hashes for the same password", async () => {
      const password = "SecurePassword123!";

      const firstHash = await hashPassword(password);
      const secondHash = await hashPassword(password);

      expect(firstHash).not.toBe(secondHash);
    });
  });

  describe("comparePasswords", () => {
    it("returns true for the correct password", async () => {
      const password = "SecurePassword123!";
      const hash = await hashPassword(password);

      const result = await comparePasswords(password, hash);

      expect(result).toBe(true);
    });

    it("returns false for an incorrect password", async () => {
      const password = "SecurePassword123!";
      const hash = await hashPassword(password);

      const result = await comparePasswords("WrongPassword123!", hash);

      expect(result).toBe(false);
    });

    it("returns false when password casing is different", async () => {
      const password = "SecurePassword123!";
      const hash = await hashPassword(password);

      const result = await comparePasswords("securepassword123!", hash);

      expect(result).toBe(false);
    });

    it("works with a long password", async () => {
      const password = "A".repeat(100) + "Secure123!";

      const hash = await hashPassword(password);
      const result = await comparePasswords(password, hash);

      expect(result).toBe(true);
    });
  });
});
