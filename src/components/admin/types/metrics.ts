export interface AdvertisementReviewCount {
  status: string;
  count: number;
  created_at: string;
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

export interface AdMetricsResponse {
  current: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    approvalRate: number;
  };
  previous?: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    approvalRate: number;
  };
}