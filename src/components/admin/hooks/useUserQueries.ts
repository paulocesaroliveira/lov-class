import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "../types";
import { toast } from "sonner";

interface UsersQueryParams {
  page: number;
  pageSize: number;
  searchTerm?: string;
  role?: string;
  date?: string;
}

interface UsersResponse {
  data: Profile[];
  totalCount: number;
}

export const useUsers = (params: UsersQueryParams) => {
  const { page, pageSize, searchTerm, role, date } = params;

  return useQuery<UsersResponse>({
    queryKey: ["admin-users", params],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select("*", { count: "exact" });

      if (searchTerm) {
        query = query.ilike("name", `%${searchTerm}%`);
      }
      if (role && role !== "all") {
        query = query.eq("role", role);
      }
      if (date) {
        query = query.gte("created_at", `${date}T00:00:00`)
          .lte("created_at", `${date}T23:59:59`);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data: profiles, error: profilesError, count } = await query;

      if (profilesError) {
        console.error("Erro ao carregar usuários:", profilesError);
        toast.error("Erro ao carregar usuários");
        throw profilesError;
      }

      if (profiles && profiles.length > 0) {
        const profileIds = profiles.map(p => p.id);

        const { data: notes } = await supabase
          .from("admin_notes")
          .select("*")
          .in("user_id", profileIds);

        const { data: logs } = await supabase
          .from("user_activity_logs")
          .select("*")
          .in("user_id", profileIds);

        const enrichedProfiles = profiles.map(profile => ({
          ...profile,
          admin_notes: notes?.filter(note => note.user_id === profile.id) || [],
          user_activity_logs: logs?.filter(log => log.user_id === profile.id) || []
        }));

        return {
          data: enrichedProfiles as Profile[],
          totalCount: count || 0,
        };
      }

      return {
        data: [],
        totalCount: count || 0,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};