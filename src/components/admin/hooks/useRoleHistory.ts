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
      return data as RoleChangeHistory[];
    },
    enabled: true,
  });
};