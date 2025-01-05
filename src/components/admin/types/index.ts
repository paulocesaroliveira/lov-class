import { Database } from "@/integrations/supabase/types";

export type UserRole = Database["public"]["Enums"]["user_role"];

export interface AdminNote {
  id: string;
  note: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  user_id: string;
}

export interface UserActivityLog {
  id: string;
  action_type: string;
  description: string;
  created_at: string;
  created_by: string;
  metadata: any;
  user_id: string;
}

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  admin_notes: AdminNote[];
  user_activity_logs: UserActivityLog[];
}