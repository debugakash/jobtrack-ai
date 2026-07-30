import DashboardSkeleton from "../components/dashboard-skeleton";
import FollowUpList from "../components/follow-up-list";
import MonthlyApplicationsChart from "../components/monthly-applications-chart";
import StatsCards from "../components/stats-cards";
import StatusDistributionChart from "../components/status-distribution-chart";
import TopCompaniesChart from "../components/top-companies-chart";
import UpcomingInterviewsCard from "../components/upcoming-interviews-card";
import { useDashboardStats } from "../hooks/use-dashboard-stats";

export default function DashboardPage() {
  const { isLoading } = useDashboardStats();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="text-muted-foreground">
          Track your job applications and progress.
        </p>
      </div>

      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-2">
        <MonthlyApplicationsChart />
        <StatusDistributionChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <TopCompaniesChart />

        <FollowUpList />

        <UpcomingInterviewsCard />
      </div>
    </div>
  );
}
