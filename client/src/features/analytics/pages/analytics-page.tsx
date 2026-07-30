import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/common/page-header";

import { useAnalytics } from "../hooks/use-analytics";

import { Briefcase, CalendarDays, Gift, TrendingUp } from "lucide-react";

import AnalyticsSummaryCard from "../components/analytics-summary-card";
import MonthlyApplicationsChart from "../components/monthly-applications-chart";
import StatusDistributionChart from "../components/status-distribution-chart";
import SourceDistributionChart from "../components/source-distribution-chart";
import AnalyticsSkeleton from "../components/analytics-skeleton";
import AnalyticsEmptyState from "../components/analytics-empty-state";

export default function AnalyticsPage() {
  const [range, setRange] = useState("365");

  const { data, isLoading } = useAnalytics(range);

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  const overview = data?.overview;

  if (!overview || overview.totalApplications === 0) {
    return (
      <>
        <PageHeader
          title="Analytics"
          description="Track your job search progress."
        />

        <AnalyticsEmptyState />
      </>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Insights into your job search progress."
      />

      <div className="flex justify-end">
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
            <SelectItem value="365">Last Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <AnalyticsSummaryCard
          title="Applications"
          value={data?.overview.totalApplications ?? 0}
          icon={Briefcase}
        />

        <AnalyticsSummaryCard
          title="Interviews"
          value={data?.overview.interviews ?? 0}
          icon={CalendarDays}
        />

        <AnalyticsSummaryCard
          title="Offers"
          value={data?.overview.offers ?? 0}
          icon={Gift}
        />

        <AnalyticsSummaryCard
          title="Response Rate"
          value={`${data?.overview.responseRate ?? 0}%`}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MonthlyApplicationsChart data={data?.monthlyApplications ?? []} />

        <StatusDistributionChart data={data?.statusDistribution ?? []} />
      </div>

      <SourceDistributionChart data={data?.sourceDistribution ?? []} />
    </div>
  );
}
