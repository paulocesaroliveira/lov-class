import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserRole, Profile } from "../types";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

interface UsersQueryParams {
  page: number;
  pageSize: number;
  searchTerm?: string;
  role?: UserRole | "all";
  date?: string;
}

interface UsersResponse {
  data: Profile[];
  totalCount: number;
}

export const useUsers = (params: UsersQueryParams) => {
  const { page, pageSize, searchTerm, role, date } = params;
  const debouncedSearch = useDebounce(searchTerm, 300);

  return useQuery<UsersResponse>({
    queryKey: ["admin-users", { ...params, searchTerm: debouncedSearch }],
    queryFn: async () => {
      try {
        // Get profiles with pagination
        let query = supabase
          .from("profiles")
          .select(`
            id,
            name,
            role,
            created_at,
            updated_at
          `, { count: "exact" });

        if (debouncedSearch) {
          query = query.ilike("name", `%${debouncedSearch}%`);
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

        if (profilesError) throw profilesError;

        const profileIds = profiles?.map(p => p.id) || [];

        // Get admin notes
        const { data: notes } = await supabase
          .from("admin_notes")
          .select("*")
          .in("user_id", profileIds);

        // Get activity logs
        const { data: logs } = await supabase
          .from("user_activity_logs")
          .select("*")
          .in("user_id", profileIds);

        // Merge the data
        const enrichedProfiles = profiles?.map(profile => ({
          ...profile,
          admin_notes: notes?.filter(note => note.user_id === profile.id) || [],
          user_activity_logs: logs?.filter(log => log.user_id === profile.id) || []
        })) as Profile[];

        return {
          data: enrichedProfiles,
          totalCount: count || 0,
        };
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Erro ao carregar usuários");
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};