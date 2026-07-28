import DashboardStatCard from "./dashboard-stat-card";
import { useDashboardStats } from "../hooks/use-dashboard-stats";

export default function StatsCards() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading || !data) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <DashboardStatCard title="Total Jobs" value={data.totalJobs} />

      <DashboardStatCard title="Wishlist" value={data.wishlist} />

      <DashboardStatCard title="Applied" value={data.applied} />

      <DashboardStatCard title="Screening" value={data.screening} />

      <DashboardStatCard title="Interviews" value={data.interview} />

      <DashboardStatCard title="Offers" value={data.offer} />

      <DashboardStatCard title="Accepted" value={data.accepted} />

      <DashboardStatCard title="Rejected" value={data.rejected} />
    </div>
  );
}
