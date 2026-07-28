import FollowUpList from "../components/follow-up-list";
import MonthlyApplicationsChart from "../components/monthly-applications-chart";
import StatsCards from "../components/stats-cards";
import StatusDistributionChart from "../components/status-distribution-chart";
import TopCompaniesChart from "../components/top-companies-chart";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="text-muted-foreground">
          Track your job applications and progress.
        </p>
      </div>

      <StatsCards />

      <MonthlyApplicationsChart />

      <StatusDistributionChart />

      <TopCompaniesChart />

      <FollowUpList />
    </div>
  );
}
