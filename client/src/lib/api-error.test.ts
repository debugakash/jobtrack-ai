import axios from "axios";
import { describe, expect, it } from "vitest";

import { getApiErrorMessage } from "./api-error";

describe("getApiErrorMessage", () => {
  it("returns the API error message for an Axios error", () => {
    const error = new axios.AxiosError("Request failed");

    error.response = {
      data: {
        message: "Invalid credentials",
      },
      status: 401,
      statusText: "Unauthorized",
      headers: {},
      config: {
        headers: new axios.AxiosHeaders(),
      },
    };

    expect(getApiErrorMessage(error)).toBe("Invalid credentials");
  });

  it("returns the fallback for a non-Axios error", () => {
    const error = new Error("Something failed");

    expect(getApiErrorMessage(error)).toBe(
      "Something went wrong. Please try again.",
    );
  });

  it("returns the custom fallback for a non-Axios error", () => {
    const error = new Error("Something failed");

    expect(getApiErrorMessage(error, "Custom error")).toBe("Custom error");
  });

  it("returns the fallback when an Axios error has no response message", () => {
    const error = new axios.AxiosError("Request failed");

    expect(getApiErrorMessage(error)).toBe(
      "Something went wrong. Please try again.",
    );
  });

  it("returns the custom fallback when an Axios error has no response message", () => {
    const error = new axios.AxiosError("Request failed");

    expect(getApiErrorMessage(error, "Custom fallback")).toBe(
      "Custom fallback",
    );
  });
});
