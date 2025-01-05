export interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  previousPeriod?: {
    totalUsers: number;
    activeUsers: number;
  };
}