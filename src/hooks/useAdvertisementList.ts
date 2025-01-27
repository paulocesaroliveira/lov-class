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
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from("advertisements")
        .select(`
          *,
          advertisement_services (*),
          advertisement_service_locations (*),
          advertisement_photos (*),
          advertisement_videos (*),
          advertisement_comments (*),
          advertisement_reviews (*),
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

      const from = Number(pageParam) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query
        .range(from, to)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return {
        data: data as Advertisement[],
        totalCount: count || 0,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length;
      return nextPage * 10 < lastPage.totalCount ? nextPage : undefined;
    },
  });
};