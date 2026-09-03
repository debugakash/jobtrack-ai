import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { updateJob } from "../api/update-job";
import { useUpdateJob } from "./use-update-job";

import {
  invalidateDashboard,
  invalidateJobs,
  invalidateNotifications,
} from "@/lib/query-invalidations";

import { toast } from "sonner";

vi.mock("../api/update-job", () => ({
  updateJob: vi.fn(),
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

describe("useUpdateJob", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls updateJob with the correct id and data", async () => {
    vi.mocked(updateJob).mockResolvedValue({
      success: true,
      data: {},
    } as never);

    const { result } = renderHook(() => useUpdateJob(), {
      wrapper: createWrapper(),
    });

    const data = {
      company: "Google",
      jobTitle: "Senior Frontend Developer",
    };

    await result.current.mutateAsync({
      id: "job-123",
      data: data as never,
    });

    expect(updateJob).toHaveBeenCalledWith("job-123", data);
  });

  it("invalidates related queries and shows a success toast", async () => {
    vi.mocked(updateJob).mockResolvedValue({
      success: true,
      data: {},
    } as never);

    const { result } = renderHook(() => useUpdateJob(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      id: "job-123",
      data: {
        company: "Google",
        jobTitle: "Frontend Developer",
      } as never,
    });

    expect(invalidateJobs).toHaveBeenCalledTimes(1);
    expect(invalidateNotifications).toHaveBeenCalledTimes(1);
    expect(invalidateDashboard).toHaveBeenCalledTimes(1);

    expect(toast.success).toHaveBeenCalledWith("Job updated successfully");
  });

  it("shows an error toast when the mutation fails", async () => {
    vi.mocked(updateJob).mockRejectedValue(new Error("Request failed"));

    const { result } = renderHook(() => useUpdateJob(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        id: "job-123",
        data: {
          company: "Google",
          jobTitle: "Frontend Developer",
        } as never,
      }),
    ).rejects.toThrow("Request failed");

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to update job");
    });
  });
});
