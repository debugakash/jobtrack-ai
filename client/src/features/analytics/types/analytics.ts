export interface AnalyticsOverview {
  totalApplications: number;
  offers: number;
  interviews: number;
  rejections: number;

  responseRate: number;
  interviewRate: number;
  offerRate: number;
  rejectionRate: number;
}

export interface MonthlyApplication {
  month: string;
  count: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
}

export interface SourceDistribution {
  source: string | null;
  count: number;
}

export interface ApplicationFunnel {
  status: string;
  count: number;
}

export interface AnalyticsResponse {
  overview: AnalyticsOverview;

  monthlyApplications: MonthlyApplication[];

  statusDistribution: StatusDistribution[];

  sourceDistribution: SourceDistribution[];

  applicationFunnel: ApplicationFunnel[];

  averageTimeToInterview: number;

  averageTimeToResponse: number;
}
