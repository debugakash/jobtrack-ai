import { describe, expect, it, vi } from "vitest";
import { ZodError, z } from "zod";
import jwt from "jsonwebtoken";
import { errorHandler } from "./error.middleware.js";
import { AppError, BadRequestError } from "../errors/index.js";

describe("errorHandler", () => {
  function createMockResponse() {
    const json = vi.fn();
    const status = vi.fn(() => ({ json }));

    return {
      status,
      json,
    };
  }

  const request = {} as any;
  const next = vi.fn();

  it("handles Zod validation errors with status 400", () => {
    const response = createMockResponse();

    const schema = z.object({
      email: z.email(),
    });

    let error: ZodError;

    try {
      schema.parse({
        email: "invalid-email",
      });
    } catch (err) {
      error = err as ZodError;
    }

    errorHandler(error!, request, response as any, next);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.status().json).toHaveBeenCalledWith({
      success: false,
      message: "Validation failed",
      errors: error!.issues,
    });
  });

  it("handles AppError using its status code and message", () => {
    const response = createMockResponse();
    const error = new BadRequestError("Invalid job data");

    errorHandler(error, request, response as any, next);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.status().json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid job data",
    });
  });

  it("handles a custom AppError with a custom status code", () => {
    const response = createMockResponse();
    const error = new AppError("Something went wrong", 422);

    errorHandler(error, request, response as any, next);

    expect(response.status).toHaveBeenCalledWith(422);
    expect(response.status().json).toHaveBeenCalledWith({
      success: false,
      message: "Something went wrong",
    });
  });

  it("handles a JWT error with status 401", () => {
    const response = createMockResponse();
    const error = new jwt.JsonWebTokenError("Invalid token");

    errorHandler(error, request, response as any, next);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.status().json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid or expired token",
    });
  });

  it("handles an expired JWT with status 401", () => {
    const response = createMockResponse();

    const error = new jwt.TokenExpiredError("jwt expired", new Date());

    errorHandler(error, request, response as any, next);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.status().json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid or expired token",
    });
  });

  it("handles a generic Error with status 500", () => {
    const response = createMockResponse();
    const error = new Error("Unexpected failure");

    errorHandler(error, request, response as any, next);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.status().json).toHaveBeenCalledWith({
      success: false,
      message: "Internal Server Error",
    });
  });

  it("handles an unknown error value with status 500", () => {
    const response = createMockResponse();

    errorHandler("unexpected error", request, response as any, next);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.status().json).toHaveBeenCalledWith({
      success: false,
      message: "Internal Server Error",
    });
  });

  it("handles null as an unknown error with status 500", () => {
    const response = createMockResponse();

    errorHandler(null, request, response as any, next);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.status().json).toHaveBeenCalledWith({
      success: false,
      message: "Internal Server Error",
    });
  });
});
