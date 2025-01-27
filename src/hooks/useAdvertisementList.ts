import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Advertisement } from "@/types/advertisement";

interface UseAdvertisementListParams {
  filters?: {
    search?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
  };
  pageSize?: number;
}

interface AdvertisementResponse {
  data: Advertisement[];
  totalCount: number;
}

export const useAdvertisementList = ({ filters, pageSize = 10 }: UseAdvertisementListParams) => {
  return useInfiniteQuery<AdvertisementResponse>({
    queryKey: ["advertisements", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const from = (pageParam - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from("advertisements")
        .select(`
          *,
          profile:profiles(*),
          advertisement_services(*),
          advertisement_service_locations(*),
          advertisement_photos(*),
          advertisement_videos(*),
          advertisement_reviews(*),
          advertisement_comments(*)
        `, { count: 'exact' })
        .range(from, to)
        .eq('status', 'aprovado');

      if (filters?.city) {
        query = query.eq('city', filters.city);
      }

      if (filters?.minPrice) {
        query = query.gte('hourly_rate', filters.minPrice);
      }

      if (filters?.maxPrice) {
        query = query.lte('hourly_rate', filters.maxPrice);
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return {
        data: data as unknown as Advertisement[],
        totalCount: count || 0,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      const totalPages = Math.ceil(lastPage.totalCount / pageSize);
      return nextPage <= totalPages ? nextPage : undefined;
    },
  });
};