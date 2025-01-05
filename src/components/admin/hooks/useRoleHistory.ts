import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RoleChangeHistory } from "../types/history";

export const useRoleHistory = (userId?: string) => {
  return useQuery({
    queryKey: ["role-history", userId],
    queryFn: async () => {
      let query = supabase
        .from("role_change_history")
        .select(`
          *,
          changed_by_profile:profiles!role_change_history_changed_by_fkey(name)
        `)
        .order("created_at", { ascending: false });

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform the data to match the RoleChangeHistory type
      return (data as any[]).map(item => ({
        id: item.id,
        user_id: item.user_id,
        old_role: item.old_role,
        new_role: item.new_role,
        changed_by: item.changed_by,
        reason: item.reason,
        created_at: item.created_at,
        changed_by_profile: item.changed_by_profile ? {
          name: item.changed_by_profile.name
        } : undefined
      })) as RoleChangeHistory[];
    },
    enabled: true,
  });
};