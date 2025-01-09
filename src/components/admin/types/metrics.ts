export interface DateFilter {
  startDate?: string;
  endDate?: string;
}

export interface AdminMetric {
  metric_name: string;
  metric_value: number;
  period: string;
}

export interface EngagementMetric {
  date: string;
  unique_views: number;
  total_views: number;
  whatsapp_clicks: number;
}

export interface RegionalMetric {
  state: string;
  city: string;
  view_count: number;
  click_count: number;
  active_ads: number;
}

export interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  advertisers: number;
  clients: number;
  admins: number;
  previousPeriod?: {
    totalUsers: number;
    activeUsers: number;
  };
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}