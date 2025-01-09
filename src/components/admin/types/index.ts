export type UserRole = 'cliente' | 'anunciante' | 'admin';

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  created_at: string;
  admin_notes?: AdminNote[];
}

export interface AdminNote {
  id: string;
  note: string;
  created_at: string;
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