import { describe, expect, it, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "./auth.middleware.js";
import { UnauthorizedError } from "../errors/index.js";

vi.mock("../utils/jwt.js", () => ({
  verifyAccessToken: vi.fn(),
}));

import { verifyAccessToken } from "../utils/jwt.js";

describe("authenticate middleware", () => {
  function createRequest(authorization?: string): Request {
    return {
      headers: {
        authorization,
      },
    } as Request;
  }

  const response = {} as Response;

  it("throws UnauthorizedError when authorization header is missing", () => {
    const request = createRequest();
    const next = vi.fn();

    expect(() => {
      authenticate(request, response, next);
    }).toThrow(UnauthorizedError);

    expect(() => {
      authenticate(request, response, next);
    }).toThrow("Authorization header is missing");

    expect(next).not.toHaveBeenCalled();
  });

  it("throws UnauthorizedError when authorization header does not start with Bearer", () => {
    const request = createRequest("Basic abc123");
    const next = vi.fn();

    expect(() => {
      authenticate(request, response, next);
    }).toThrow(UnauthorizedError);

    expect(() => {
      authenticate(request, response, next);
    }).toThrow("Invalid authorization header");

    expect(next).not.toHaveBeenCalled();
  });

  it("throws UnauthorizedError for an empty Bearer token", () => {
    const request = createRequest("Bearer ");
    const next = vi.fn();

    vi.mocked(verifyAccessToken).mockImplementation(() => {
      throw new UnauthorizedError("Invalid or expired token");
    });

    expect(() => {
      authenticate(request, response, next);
    }).toThrow(UnauthorizedError);

    expect(() => {
      authenticate(request, response, next);
    }).toThrow("Invalid or expired token");

    expect(next).not.toHaveBeenCalled();
  });

  it("sets req.user and calls next for a valid token", () => {
    const request = createRequest("Bearer valid-token");
    const next = vi.fn();

    const payload = {
      userId: "user-123",
      email: "test@example.com",
    };

    vi.mocked(verifyAccessToken).mockReturnValue(payload);

    authenticate(request, response, next);

    expect(verifyAccessToken).toHaveBeenCalledWith("valid-token");
    expect(request.user).toEqual(payload);
    expect(next).toHaveBeenCalledOnce();
  });

  it("propagates an error when token verification fails", () => {
    const request = createRequest("Bearer invalid-token");
    const next = vi.fn();

    const error = new UnauthorizedError("Invalid or expired token");

    vi.mocked(verifyAccessToken).mockImplementation(() => {
      throw error;
    });

    expect(() => {
      authenticate(request, response, next);
    }).toThrow(error);

    expect(next).not.toHaveBeenCalled();
  });

  it("extracts only the token from the Bearer authorization header", () => {
    const request = createRequest("Bearer abc.def.ghi");
    const next = vi.fn();

    vi.mocked(verifyAccessToken).mockReturnValue({
      userId: "user-456",
      email: "user@example.com",
    });

    authenticate(request, response, next);

    expect(verifyAccessToken).toHaveBeenCalledWith("abc.def.ghi");
    expect(next).toHaveBeenCalledOnce();
  });
});
