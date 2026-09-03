import { describe, expect, it, vi } from "vitest";

import { api } from "./api";
import { useAuthStore } from "@/stores/auth-store";

describe("api", () => {
  it("adds the Authorization header when an access token exists", async () => {
    useAuthStore.setState({
      accessToken: "test-token",
    });

    const adapter = vi.fn().mockResolvedValue({
      data: {},
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    });

    const response = await api.get("/test", {
      adapter,
    });

    expect(adapter).toHaveBeenCalledTimes(1);

    const config = adapter.mock.calls[0][0];

    expect(config.headers.Authorization).toBe("Bearer test-token");

    expect(response.status).toBe(200);
  });

  it("does not add the Authorization header when no access token exists", async () => {
    useAuthStore.setState({
      accessToken: null,
    });

    const adapter = vi.fn().mockResolvedValue({
      data: {},
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    });

    const response = await api.get("/test", {
      adapter,
    });

    expect(adapter).toHaveBeenCalledTimes(1);

    const config = adapter.mock.calls[0][0];

    expect(config.headers.Authorization).toBeUndefined();

    expect(response.status).toBe(200);
  });

  it("preserves the request configuration", async () => {
    useAuthStore.setState({
      accessToken: "test-token",
    });

    const adapter = vi.fn().mockResolvedValue({
      data: { success: true },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    });

    await api.get("/test", {
      adapter,
    });

    const config = adapter.mock.calls[0][0];

    expect(config.method).toBe("get");
    expect(config.url).toBe("/test");
    expect(config.headers.Authorization).toBe("Bearer test-token");
  });
});
