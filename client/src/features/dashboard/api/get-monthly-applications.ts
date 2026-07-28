import { api } from "@/lib/api";

export interface MonthlyApplication {
  month: string;
  count: number;
}

interface MonthlyApplicationsResponse {
  success: boolean;
  data: MonthlyApplication[];
}

export async function getMonthlyApplications() {
  const response = await api.get<MonthlyApplicationsResponse>(
    "/dashboard/monthly-applications",
  );

  return response.data.data;
}
