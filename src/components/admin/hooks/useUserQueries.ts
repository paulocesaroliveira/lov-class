import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/integrations/supabase/types/enums";

interface QueryParams {
  searchTerm?: string;
  role?: UserRole | 'all';
  date?: string;
}

export const useUserQueries = ({ searchTerm, role, date }: QueryParams) => {
  return useQuery({
    queryKey: ['users', { searchTerm, role, date }],
    queryFn: async () => {
      let query = supabase.from('profiles').select('*');

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      if (role && role !== 'all') {
        query = query.eq('role', role as UserRole);
      }

      if (date) {
        query = query
          .gte('created_at', `${date}T00:00:00`)
          .lte('created_at', `${date}T23:59:59`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    }
  });
};