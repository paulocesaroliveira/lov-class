import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Advertisement } from "@/types/advertisement";

const ITEMS_PER_PAGE = 30;

interface UseAdvertisementListProps {
  filters?: any;
}

const processAdvertisementData = (data: any[]): Advertisement[] => {
  return data.map(ad => ({
    ...ad,
    advertisement_reviews: ad.advertisement_reviews?.length > 0 
      ? [ad.advertisement_reviews.reduce((latest: any, current: any) => 
          new Date(current.updated_at) > new Date(latest.updated_at) ? current : latest
        )]
      : [],
    advertisement_photos: ad.advertisement_photos ?? [],
    advertisement_services: ad.advertisement_services ?? [],
    advertisement_service_locations: ad.advertisement_service_locations ?? []
  })) as Advertisement[];
};

export const useAdvertisementList = ({ filters = {} }: UseAdvertisementListProps) => {
  return useInfiniteQuery({
    queryKey: ["public-advertisements", filters],
    queryFn: async ({ pageParam = 0 }) => {
      console.log("Starting query with filters:", filters);
      
      const from = pageParam * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      console.log("Query parameters:", { from, to });

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
            photo_url
          ),
          advertisement_videos (
            id,
            video_url
          ),
          advertisement_comments (
            id
          ),
          advertisement_reviews (
            status,
            review_notes,
            block_reason,
            updated_at
          )
        `, { count: 'exact' })
        .eq('status', 'approved');

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.city) {
        query = query.eq('city', filters.city);
      }
      if (filters.minPrice) {
        query = query.gte('hourly_rate', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte('hourly_rate', filters.maxPrice);
      }
      if (filters.ethnicity) {
        query = query.eq('ethnicity', filters.ethnicity);
      }
      if (filters.hairColor) {
        query = query.eq('hair_color', filters.hairColor);
      }
      if (filters.bodyType) {
        query = query.eq('body_type', filters.bodyType);
      }
      if (filters.style) {
        query = query.eq('style', filters.style);
      }
      if (filters.minHeight) {
        query = query.gte('height', filters.minHeight);
      }
      if (filters.maxHeight) {
        query = query.lte('height', filters.maxHeight);
      }
      if (filters.minWeight) {
        query = query.gte('weight', filters.minWeight);
      }
      if (filters.maxWeight) {
        query = query.lte('weight', filters.maxWeight);
      }

      // Add order and pagination
      query = query
        .order("created_at", { ascending: false })
        .range(from, to);

      console.log("Executing main query...");
      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching advertisements:", error);
        toast.error("Erro ao carregar anúncios");
        throw error;
      }

      const processedData = processAdvertisementData(data || []);

      return {
        data: processedData,
        count,
        nextPage: processedData.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
