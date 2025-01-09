export type UserRole = 'user' | 'advertiser' | 'admin';

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  created_at: string;
  admin_notes?: string[];
}