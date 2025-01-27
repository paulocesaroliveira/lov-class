import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Advertisement, Filters } from "@/types/advertisement";

interface FetchAdvertisementsResponse {
  data: Advertisement[];
  totalCount: number;
}

export const useAdvertisementList = ({ filters }: { filters?: Filters }) => {
  return useInfiniteQuery({
    queryKey: ["advertisements", filters],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * 10;
      const to = from + 9;

      let query = supabase
        .from("advertisements")
        .select(`
          *,
          advertisement_services (
            service
          ),
          advertisement_service_locations (
            location
          ),
          advertisement_photos (
            photo_url
          ),
          advertisement_videos (
            video_url
          ),
          advertisement_reviews (
            id,
            status,
            review_notes,
            updated_at
          )
        `, { count: 'exact' })
        .eq('status', 'approved')
        .range(from, to);

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
        data: data as Advertisement[],
        totalCount: count || 0
      } as FetchAdvertisementsResponse;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.length < 10) return undefined;
      return pages.length;
    },
    initialPageParam: 0
  });
};