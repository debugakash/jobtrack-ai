import { useLocation } from "react-router-dom";

import { navigation, secondaryNavigation } from "@/config/navigation";
import UserMenu from "./user-menu";
import MobileSidebar from "../sidebar/mobile-sidebar";
import ThemeToggle from "@/components/theme-toggle";

export default function Navbar() {
  const location = useLocation();

  const page = [...navigation, ...secondaryNavigation].find(
    (item) => item.href === location.pathname,
  );

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu button (functionality comes next) */}
        <div className="lg:hidden">
          <MobileSidebar />
        </div>

        <h2 className="text-xl font-semibold">
          {page?.title ?? "JobTrack AI"}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
