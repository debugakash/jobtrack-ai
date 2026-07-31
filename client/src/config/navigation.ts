import {
  BarChart3,
  Briefcase,
  CalendarDays,
  ClipboardList,
  Columns3,
  FileText,
  History,
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
    title: "Board",
    href: "/board",
    icon: Columns3,
  },
  {
    title: "Interviews",
    href: "/interviews",
    icon: ClipboardList,
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: CalendarDays,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Activity",
    href: "/activity",
    icon: History,
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
