export interface EngagementMetric {
  date: string;
  unique_views: number;
  total_views: number;
  whatsapp_clicks: number;
}

export interface EngagementMetrics {
  metrics: EngagementMetric[];
}

export interface RegionalMetric {
  state: string;
  city: string;
  view_count: number;
  click_count: number;
  active_ads: number;
}

export interface RegionalMetrics {
  metrics: RegionalMetric[];
}

export interface DateFilter {
  startDate?: string;
  endDate?: string;
}