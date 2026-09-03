import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { attachResume } from "../api/attach-resume";
import { useAttachResume } from "./use-attach-resume";

import { toast } from "sonner";

vi.mock("../api/attach-resume", () => ({
  attachResume: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}));

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useAttachResume", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls attachResume with the correct job and resume ids", async () => {
    vi.mocked(attachResume).mockResolvedValue({
      success: true,
      data: {},
    } as never);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    });

    const { result } = renderHook(() => useAttachResume("job-123"), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.mutateAsync("resume-456");

    expect(attachResume).toHaveBeenCalledWith("job-123", "resume-456");
  });

  it("invalidates the job and jobs queries and shows a success toast", async () => {
    vi.mocked(attachResume).mockResolvedValue({
      success: true,
      data: {},
    } as never);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    });

    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useAttachResume("job-123"), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.mutateAsync("resume-456");

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["job", "job-123"],
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["jobs"],
    });

    expect(toast.success).toHaveBeenCalledWith("Resume updated");
  });

  it("passes null to attachResume when the resume is detached", async () => {
    vi.mocked(attachResume).mockResolvedValue({
      success: true,
      data: {},
    } as never);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    });

    const { result } = renderHook(() => useAttachResume("job-123"), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.mutateAsync(null);

    expect(attachResume).toHaveBeenCalledWith("job-123", null);
  });
});
