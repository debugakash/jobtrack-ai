import { describe, expect, it } from "vitest";
import { AppError } from "./AppError.js";
import { BadRequestError } from "./BadRequestError.js";
import { ConflictError } from "./ConflictError.js";
import { NotFoundError } from "./NotFoundError.js";
import { UnauthorizedError } from "./UnauthorizedError.js";
import { AIServiceError } from "./AIServiceError.js";

describe("application errors", () => {
  describe("AppError", () => {
    it("sets the message and status code", () => {
      const error = new AppError("Something went wrong", 500);

      expect(error.message).toBe("Something went wrong");
      expect(error.statusCode).toBe(500);
    });

    it("extends the native Error class", () => {
      const error = new AppError("Something went wrong", 500);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
    });

    it("uses the class name as the error name", () => {
      const error = new AppError("Something went wrong", 500);

      expect(error.name).toBe("AppError");
    });
  });

  describe("BadRequestError", () => {
    it("uses the default message and 400 status code", () => {
      const error = new BadRequestError();

      expect(error.message).toBe("Bad Request");
      expect(error.statusCode).toBe(400);
    });

    it("accepts a custom message", () => {
      const error = new BadRequestError("Invalid job data");

      expect(error.message).toBe("Invalid job data");
      expect(error.statusCode).toBe(400);
    });

    it("extends AppError", () => {
      const error = new BadRequestError();

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe("ConflictError", () => {
    it("uses the default message and 409 status code", () => {
      const error = new ConflictError();

      expect(error.message).toBe("Conflict");
      expect(error.statusCode).toBe(409);
    });

    it("accepts a custom message", () => {
      const error = new ConflictError("Email already exists");

      expect(error.message).toBe("Email already exists");
      expect(error.statusCode).toBe(409);
    });
  });

  describe("NotFoundError", () => {
    it("uses the default message and 404 status code", () => {
      const error = new NotFoundError();

      expect(error.message).toBe("Resource not found");
      expect(error.statusCode).toBe(404);
    });

    it("accepts a custom message", () => {
      const error = new NotFoundError("Job not found");

      expect(error.message).toBe("Job not found");
      expect(error.statusCode).toBe(404);
    });
  });

  describe("UnauthorizedError", () => {
    it("uses the default message and 401 status code", () => {
      const error = new UnauthorizedError();

      expect(error.message).toBe("Unauthorized");
      expect(error.statusCode).toBe(401);
    });

    it("accepts a custom message", () => {
      const error = new UnauthorizedError("Invalid access token");

      expect(error.message).toBe("Invalid access token");
      expect(error.statusCode).toBe(401);
    });
  });

  describe("AIServiceError", () => {
    it("uses the default message and 503 status code", () => {
      const error = new AIServiceError();

      expect(error.message).toBe(
        "AI service is temporarily unavailable. Please try again.",
      );
      expect(error.statusCode).toBe(503);
    });

    it("accepts a custom message", () => {
      const error = new AIServiceError("Gemini service failed");

      expect(error.message).toBe("Gemini service failed");
      expect(error.statusCode).toBe(503);
    });

    it("accepts a custom status code", () => {
      const error = new AIServiceError("AI request failed", 502);

      expect(error.message).toBe("AI request failed");
      expect(error.statusCode).toBe(502);
    });

    it("extends AppError", () => {
      const error = new AIServiceError();

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(Error);
    });
  });
});
