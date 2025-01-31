export interface UserActivityLog {
  id: string;
  user_id: string;
  action_type: string;
  description: string;
  metadata: any;
  created_at: string;
  created_by: string;
}

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

export type UserRole = 'admin' | 'cliente' | 'anunciante' | 'moderador';