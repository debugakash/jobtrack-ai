import type { QueryClient } from "@tanstack/react-query";

export function invalidateNotifications(queryClient: QueryClient) {
  queryClient.invalidateQueries({
    queryKey: ["notifications"],
  });
}

export function invalidateDashboard(queryClient: QueryClient) {
  queryClient.invalidateQueries({
    queryKey: ["dashboard-stats"],
  });

  queryClient.invalidateQueries({
    queryKey: ["dashboard-upcoming-interviews"],
  });
}

export function invalidateJobs(queryClient: QueryClient) {
  queryClient.invalidateQueries({
    queryKey: ["jobs"],
  });
}

export function invalidateJobInterviews(
  queryClient: QueryClient,
  jobId: string,
) {
  queryClient.invalidateQueries({
    queryKey: ["interviews", jobId],
  });
}
