import { useLocation } from "react-router-dom";

import { navigation, secondaryNavigation } from "@/config/navigation";
import UserMenu from "./user-menu";
import MobileSidebar from "../sidebar/mobile-sidebar";
import ThemeToggle from "@/components/theme-toggle";
import NotificationBell from "@/features/notifications/components/notification-bell";

export default function Navbar() {
  const location = useLocation();

  const page = [...navigation, ...secondaryNavigation].find(
    (item) => item.href === location.pathname,
  );

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <div className="lg:hidden">
          <MobileSidebar />
        </div>

        <h2 className="text-xl font-semibold">
          {page?.title ?? "JobTrack AI"}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <NotificationBell />

        <UserMenu />
      </div>
    </header>
  );
}
