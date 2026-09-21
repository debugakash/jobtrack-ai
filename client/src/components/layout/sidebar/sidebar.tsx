import { Separator } from "@/components/ui/separator";
import { navigation, secondaryNavigation } from "@/config/navigation";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <NavLink to="/" className="flex items-center gap-2.5">
          <img
            src="/jobtrack-ai-icon.png"
            alt="JobTrack AI"
            className="h-9 w-9 object-contain"
          />
          <span className="text-xl font-bold">JobTrack AI</span>
        </NavLink>
      </div>

      <nav className="flex flex-1 flex-col justify-between p-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`
                }
              >
                <Icon className="h-5 w-5" />

                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="space-y-3">
          <Separator />

          {secondaryNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`
                }
              >
                <Icon className="h-5 w-5" />

                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
