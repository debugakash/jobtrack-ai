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

export function invalidateJob(queryClient: QueryClient, jobId: string) {
  queryClient.invalidateQueries({
    queryKey: ["job", jobId],
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

export function invalidateCalendarInterviews(queryClient: QueryClient) {
  queryClient.invalidateQueries({
    queryKey: ["calendar-interviews"],
  });
}
