import { useQuery } from "@tanstack/react-query";

import { getNotifications } from "../api/get-notifications";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],

    queryFn: getNotifications,

    refetchInterval: 10000,

    refetchIntervalInBackground: true,

    staleTime: 5000,

    refetchOnWindowFocus: true,
  });
}
