import {
  Briefcase,
  CalendarDays,
  FileText,
  LayoutDashboard,
  Settings,
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Jobs",
    href: "/jobs",
    icon: Briefcase,
  },
  {
    title: "Interviews",
    href: "/interviews",
    icon: CalendarDays,
  },
  {
    title: "Resumes",
    href: "/resumes",
    icon: FileText,
  },
] as const;

export const secondaryNavigation = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
] as const;
