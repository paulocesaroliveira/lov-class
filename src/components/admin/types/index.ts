export type UserRole = 'cliente' | 'anunciante' | 'admin';

export interface AdminNote {
  id: string;
  user_id: string;
  note: string;
  created_by: string;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  admin_notes: AdminNote[];
  user_activity_logs: {
    id: string;
    user_id: string;
    action_type: string;
    description: string;
    created_by: string;
    created_at: string;
    metadata: Record<string, any>;
  }[];
}

export interface DateFilter {
  startDate?: string;
  endDate?: string;
}

export interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

export interface EngagementMetric {
  date: string;
  total_users: number;
  active_users: number;
}