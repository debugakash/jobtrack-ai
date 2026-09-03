import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { createJob } from "../api/create-job";
import { useCreateJob } from "./use-create-job";

import {
  invalidateDashboard,
  invalidateJobs,
  invalidateNotifications,
} from "@/lib/query-invalidations";

import { toast } from "sonner";

vi.mock("../api/create-job", () => ({
  createJob: vi.fn(),
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

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useCreateJob", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls createJob when the mutation is executed", async () => {
    vi.mocked(createJob).mockResolvedValue({
      success: true,
      data: {},
    } as never);

    const { result } = renderHook(() => useCreateJob(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      company: "Google",
      jobTitle: "Frontend Developer",
    } as never);

    expect(createJob).toHaveBeenCalledWith(
      {
        company: "Google",
        jobTitle: "Frontend Developer",
      },
      expect.any(Object),
    );
  });

  it("invalidates related queries and shows a success toast", async () => {
    vi.mocked(createJob).mockResolvedValue({
      success: true,
      data: {},
    } as never);

    const { result } = renderHook(() => useCreateJob(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      company: "Google",
      jobTitle: "Frontend Developer",
    } as never);

    expect(invalidateJobs).toHaveBeenCalledTimes(1);
    expect(invalidateNotifications).toHaveBeenCalledTimes(1);
    expect(invalidateDashboard).toHaveBeenCalledTimes(1);

    expect(toast.success).toHaveBeenCalledWith("Job created successfully");
  });

  it("shows an error toast when the mutation fails", async () => {
    vi.mocked(createJob).mockRejectedValue(new Error("Request failed"));

    const { result } = renderHook(() => useCreateJob(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        company: "Google",
        jobTitle: "Frontend Developer",
      } as never),
    ).rejects.toThrow("Request failed");

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to create job");
    });
  });
});
