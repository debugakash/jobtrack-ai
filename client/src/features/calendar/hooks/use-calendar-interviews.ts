import { useQuery } from "@tanstack/react-query";

import { getCalendarInterviews } from "../api/get-calendar-interviews";

export function useCalendarInterviews() {
  return useQuery({
    queryKey: ["calendar-interviews"],

    queryFn: getCalendarInterviews,
  });
}
