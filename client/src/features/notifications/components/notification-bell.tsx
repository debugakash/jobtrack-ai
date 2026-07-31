import { Bell, CheckCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { formatDistanceToNow } from "date-fns";

import { useNotifications } from "../hooks/use-notifications";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMarkNotificationRead } from "../hooks/use-mark-notification-read";
import { useMarkAllRead } from "../hooks/use-mark-all-read";

export default function NotificationBell() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const { data } = useNotifications();

  const markAsRead = useMarkNotificationRead();

  const markAllRead = useMarkAllRead();

  const unreadCount =
    data?.filter((notification) => !notification.isRead).length ?? 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1 text-xs font-semibold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between p-4">
          <div>
            <h3 className="font-semibold">Notifications</h3>

            <p className="text-xs text-muted-foreground">
              {unreadCount} unread
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            disabled={unreadCount === 0 || markAllRead.isPending}
            onClick={async () => {
              await markAllRead.mutateAsync();
            }}
            className="h-8 gap-1 px-2"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all
          </Button>
        </div>

        <Separator />

        {data && data.length > 0 ? (
          <ScrollArea className="max-h-[420px]">
            {data.map((notification) => (
              <div
                key={notification.id}
                onClick={async () => {
                  if (!notification.isRead) {
                    await markAsRead.mutateAsync(notification.id);
                  }

                  setOpen(false);

                  if (notification.actionUrl) {
                    navigate(notification.actionUrl);
                  }
                }}
                className={`cursor-pointer border-b p-4 transition-colors hover:bg-muted/40 ${
                  !notification.isRead ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{notification.title}</p>

                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
        ) : (
          <div className="p-8 text-center text-sm text-muted-foreground">
            You're all caught up 🎉
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
