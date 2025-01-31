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

      console.log("Fetching advertisements with filters:", filters);

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
            id,
            advertisement_id,
            photo_url,
            created_at
          ),
          advertisement_videos (
            id,
            advertisement_id,
            video_url,
            created_at
          ),
          advertisement_reviews (
            id,
            moderation_status,
            review_notes,
            updated_at
          )
        `, { count: 'exact' })
        .eq('blocked', false)
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

      console.log("Executing query...");
      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching advertisements:", error);
        throw error;
      }

      console.log("Fetched advertisements:", data);
      
      return {
        data: data as unknown as Advertisement[],
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