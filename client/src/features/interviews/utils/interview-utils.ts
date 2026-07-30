import { Briefcase, Circle, Laptop, Trophy, User } from "lucide-react";

import { differenceInCalendarDays, startOfDay } from "date-fns";

export function getRoundConfig(round: string) {
  const value = round.toLowerCase();

  if (value.includes("hr")) {
    return {
      Icon: User,
      color: "text-sky-500",
    };
  }

  if (value.includes("tech")) {
    return {
      Icon: Laptop,
      color: "text-violet-500",
    };
  }

  if (value.includes("manager")) {
    return {
      Icon: Briefcase,
      color: "text-amber-500",
    };
  }

  if (value.includes("final")) {
    return {
      Icon: Trophy,
      color: "text-emerald-500",
    };
  }

  return {
    Icon: Circle,
    color: "text-muted-foreground",
  };
}

export function getInterviewBadge(date: string) {
  const today = startOfDay(new Date());
  const interviewDay = startOfDay(new Date(date));

  const diff = differenceInCalendarDays(interviewDay, today);

  if (diff < 0)
    return {
      label: "Overdue",
      className: "bg-red-700 text-white",
    };

  if (diff === 0)
    return {
      label: "Today",
      className: "bg-red-500 text-white",
    };

  if (diff === 1)
    return {
      label: "Tomorrow",
      className: "bg-orange-500 text-white",
    };

  if (diff <= 7)
    return {
      label: `In ${diff} days`,
      className: "bg-emerald-600 text-white",
    };

  return null;
}
