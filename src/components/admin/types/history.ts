export interface RoleChangeHistory {
  id: string;
  user_id: string;
  old_role: string;
  new_role: string;
  changed_by: string;
  reason?: string;
  created_at: string;
}

export interface UserMetrics {
  role: string;
  total_users: number;
  new_users_30d: number;
  active_users_7d: number;
}