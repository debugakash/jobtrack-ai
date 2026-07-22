import { useLocation } from "react-router-dom";

import { navigation, secondaryNavigation } from "@/config/navigation";
import UserMenu from "./user-menu";

export default function Navbar() {
  const location = useLocation();

  const page = [...navigation, ...secondaryNavigation].find(
    (item) => item.href === location.pathname,
  );

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h2 className="text-xl font-semibold">{page?.title ?? "JobTrack AI"}</h2>

      <UserMenu />
    </header>
  );
}
