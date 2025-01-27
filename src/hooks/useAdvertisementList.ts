import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Advertisement, Filters } from "@/types/advertisement";

interface UseAdvertisementListParams {
  filters?: Filters;
  pageSize?: number;
}

export const useAdvertisementList = ({ filters, pageSize = 10 }: UseAdvertisementListParams) => {
  return useInfiniteQuery({
    queryKey: ['advertisements', filters],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('advertisements')
        .select(`
          *,
          profile:profiles(*),
          advertisement_services(*),
          advertisement_service_locations(*),
          advertisement_photos(*),
          advertisement_videos(*),
          advertisement_comments(*)
        `, { count: 'exact' })
        .range(from, to)
        .eq('status', 'approved');

      if (filters?.city) {
        query = query.eq('city', filters.city);
      }

      if (filters?.state) {
        query = query.eq('state', filters.state);
      }

      if (filters?.minPrice) {
        query = query.gte('hourly_rate', filters.minPrice);
      }

      if (filters?.maxPrice) {
        query = query.lte('hourly_rate', filters.maxPrice);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data as unknown as Advertisement[],
        pageParam,
        count: count || 0,
      };
    },
    getNextPageParam: (lastPage, pages) => {
      const totalPages = Math.ceil((lastPage.count || 0) / pageSize);
      const nextPage = pages.length;
      return nextPage < totalPages ? nextPage : undefined;
    },
  });
};