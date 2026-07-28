import { api } from "@/lib/api";

export interface TopCompany {
  company: string;
  count: number;
}

interface TopCompaniesResponse {
  success: boolean;
  data: TopCompany[];
}

export async function getTopCompanies() {
  const response = await api.get<TopCompaniesResponse>(
    "/dashboard/top-companies",
  );

  return response.data.data;
}
