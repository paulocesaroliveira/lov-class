import { useQuery } from "@tanstack/react-query";
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
      let query = supabase
        .from("profiles")
        .select(`
          id,
          name,
          role,
          created_at,
          updated_at,
          admin_notes (
            id,
            note,
            created_at,
            created_by,
            user_id
          ),
          user_activity_logs (
            id,
            action_type,
            description,
            metadata,
            created_at,
            user_id
          )
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

      if (profilesError) {
        toast.error("Erro ao carregar usuários");
        throw profilesError;
      }

      return {
        data: profiles as unknown as Profile[],
        totalCount: count || 0,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};