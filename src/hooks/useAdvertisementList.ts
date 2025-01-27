import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UseAdvertisementListParams {
  filters?: {
    search?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
  };
  pageSize?: number;
}

export const useAdvertisementList = ({ filters, pageSize = 10 }: UseAdvertisementListParams) => {
  return useInfiniteQuery({
    queryKey: ["advertisements", filters],
    queryFn: async ({ pageParam = 0 }) => {
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

      const from = pageParam * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query
        .range(from, to)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return {
        data: data || [],
        totalCount: count || 0,
        nextPage: data?.length === pageSize ? pageParam + 1 : undefined
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};