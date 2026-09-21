import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { navigation, secondaryNavigation } from "@/config/navigation";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b p-6">
          <SheetTitle asChild>
            <NavLink to="/" className="flex items-center gap-2.5">
              <img
                src="/jobtrack-ai-icon.png"
                alt="JobTrack AI"
                className="h-9 w-9 object-contain"
              />
              <span className="text-xl font-bold">JobTrack AI</span>
            </NavLink>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex h-full flex-col justify-between p-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpen(false)}
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
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-slate-100"
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
      </SheetContent>
    </Sheet>
  );
}
