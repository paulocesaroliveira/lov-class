export type UserRole = 'cliente' | 'anunciante' | 'admin';

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  admin_notes?: AdminNote[];
  user_activity_logs?: UserActivityLog[];
}

export interface AdminNote {
  id: string;
  user_id: string;
  note: string;
  created_by: string;
  created_at: string;
}

export interface UserActivityLog {
  id: string;
  user_id: string;
  action_type: string;
  description: string;
  created_by: string;
  created_at: string;
  metadata: Record<string, any>;
}

export interface DateFilter {
  startDate?: string;
  endDate?: string;
}

export interface UserMetrics {
  totalUsers: number;
  advertisers: number;
  clients: number;
  admins: number;
  activeUsers: number;
  inactiveUsers: number;
  previousPeriod?: {
    totalUsers: number;
    activeUsers: number;
  };
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