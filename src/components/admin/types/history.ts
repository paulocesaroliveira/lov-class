export interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  previousPeriod?: {
    totalUsers: number;
    activeUsers: number;
  };
}

export interface UserMetrics {
  total_users: number;
  active_users_7d: number;
  new_users_30d: number;
  role: "user" | "admin" | "advertiser";
}

export interface RoleChangeHistory {
  id: string;
  user_id: string;
  old_role: string;
  new_role: string;
  changed_by: string;
  reason?: string;
  created_at: string;
  changed_by_profile?: {
    name: string;
  };
}