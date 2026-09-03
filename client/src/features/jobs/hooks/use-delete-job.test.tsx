import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { deleteJob } from "../api/delete-job";
import { useDeleteJob } from "./use-delete-job";

import {
  invalidateDashboard,
  invalidateJobs,
  invalidateNotifications,
} from "@/lib/query-invalidations";

import { toast } from "sonner";

vi.mock("../api/delete-job", () => ({
  deleteJob: vi.fn(),
}));

vi.mock("@/lib/query-invalidations", () => ({
  invalidateDashboard: vi.fn(),
  invalidateJobs: vi.fn(),
  invalidateNotifications: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

function createWrapper() {
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

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useDeleteJob", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls deleteJob with the correct job id", async () => {
    vi.mocked(deleteJob).mockResolvedValue({
      success: true,
    } as never);

    const { result } = renderHook(() => useDeleteJob(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync("job-123");

    expect(deleteJob).toHaveBeenCalledWith("job-123", expect.any(Object));
  });

  it("invalidates related queries and shows a success toast", async () => {
    vi.mocked(deleteJob).mockResolvedValue({
      success: true,
    } as never);

    const { result } = renderHook(() => useDeleteJob(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync("job-123");

    expect(invalidateJobs).toHaveBeenCalledTimes(1);
    expect(invalidateNotifications).toHaveBeenCalledTimes(1);
    expect(invalidateDashboard).toHaveBeenCalledTimes(1);

    expect(toast.success).toHaveBeenCalledWith("Job deleted successfully");
  });

  it("shows an error toast when the mutation fails", async () => {
    vi.mocked(deleteJob).mockRejectedValue(new Error("Request failed"));

    const { result } = renderHook(() => useDeleteJob(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.mutateAsync("job-123")).rejects.toThrow(
      "Request failed",
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to delete job");
    });
  });
});
