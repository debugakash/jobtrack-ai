import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markNotificationRead } from "../api/mark-notification-read";

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });
}
