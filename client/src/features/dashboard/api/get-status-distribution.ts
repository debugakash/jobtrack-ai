import { api } from "@/lib/api";

export interface StatusDistributionItem {
  status: string;
  count: number;
}

interface StatusDistributionResponse {
  success: boolean;
  data: StatusDistributionItem[];
}

export async function getStatusDistribution() {
  const response = await api.get<StatusDistributionResponse>(
    "/dashboard/status-distribution",
  );

  return response.data.data;
}
