import { api } from "@/lib/api";

import type { Job } from "../types/job";

export interface GetJobsParams {
  search?: string;
  status?: string;
  jobType?: string;
  workMode?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetJobsResponse {
  success: boolean;

  data: Job[];

  pagination: Pagination;
}

export async function getJobs(params: GetJobsParams) {
  const response = await api.get<GetJobsResponse>("/jobs", {
    params,
  });

  return response.data;
}
