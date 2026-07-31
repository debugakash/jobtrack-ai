import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markAllNotificationsRead } from "../api/mark-all-read";

export function useMarkAllRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });
}
