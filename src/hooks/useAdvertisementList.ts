import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UseAdvertisementListParams {
  page: number;
  pageSize: number;
  filters?: {
    search?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
  };
}

export const useAdvertisementList = ({ page, pageSize, filters }: UseAdvertisementListParams) => {
  return useQuery({
    queryKey: ["advertisements", { page, pageSize, filters }],
    queryFn: async () => {
      let query = supabase
        .from("advertisements")
        .select(`
          *,
          profile:profiles(name)
        `, { count: "exact" });

      if (filters?.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      if (filters?.city) {
        query = query.eq("city", filters.city);
      }

      if (filters?.minPrice) {
        query = query.gte("hourly_rate", filters.minPrice);
      }

      if (filters?.maxPrice) {
        query = query.lte("hourly_rate", filters.maxPrice);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query
        .range(from, to)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return {
        data: data || [],
        totalCount: count || 0,
      };
    },
  });
};