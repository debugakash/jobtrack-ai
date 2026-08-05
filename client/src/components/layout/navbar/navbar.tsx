import UserMenu from "./user-menu";
import MobileSidebar from "../sidebar/mobile-sidebar";
import ThemeToggle from "@/components/theme-toggle";
import NotificationBell from "@/features/notifications/components/notification-bell";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <div className="lg:hidden">
          <MobileSidebar />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        <NotificationBell />

        <UserMenu />
      </div>
    </header>
  );
}
