import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Advertisement } from "@/types/advertisement";

const ITEMS_PER_PAGE = 30;

interface UseAdvertisementListProps {
  filters?: any;
}

export const useAdvertisementList = ({ filters = {} }: UseAdvertisementListProps) => {
  return useInfiniteQuery({
    queryKey: ["public-advertisements", filters],
    queryFn: async ({ pageParam = 0 }) => {
      console.log("Starting query with filters:", filters);
      
      const from = pageParam * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

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
            updated_at
          )
        `, { count: 'exact' })
        .eq('status', 'approved')
        .eq('blocked', false);

      // Log initial query state
      console.log("Initial query state:", { from, to });

      // Apply filters with logging
      if (Object.keys(filters).length > 0) {
        console.log("Applying filters to query...");
        
        if (filters.category) {
          console.log("Applying category filter:", filters.category);
          query = query.eq('category', filters.category);
        }
        if (filters.city) {
          console.log("Applying city filter:", filters.city);
          query = query.eq('city', filters.city);
        }
        if (filters.minPrice) {
          console.log("Applying minPrice filter:", filters.minPrice);
          query = query.gte('hourly_rate', filters.minPrice);
        }
        if (filters.maxPrice) {
          console.log("Applying maxPrice filter:", filters.maxPrice);
          query = query.lte('hourly_rate', filters.maxPrice);
        }
        if (filters.ethnicity) {
          console.log("Applying ethnicity filter:", filters.ethnicity);
          query = query.eq('ethnicity', filters.ethnicity);
        }
        if (filters.hairColor) {
          console.log("Applying hairColor filter:", filters.hairColor);
          query = query.eq('hair_color', filters.hairColor);
        }
        if (filters.bodyType) {
          console.log("Applying bodyType filter:", filters.bodyType);
          query = query.eq('body_type', filters.bodyType);
        }
        if (filters.style) {
          console.log("Applying style filter:", filters.style);
          query = query.eq('style', filters.style);
        }
        if (filters.minHeight) {
          console.log("Applying minHeight filter:", filters.minHeight);
          query = query.gte('height', filters.minHeight);
        }
        if (filters.maxHeight) {
          console.log("Applying maxHeight filter:", filters.maxHeight);
          query = query.lte('height', filters.maxHeight);
        }
        if (filters.minWeight) {
          console.log("Applying minWeight filter:", filters.minWeight);
          query = query.gte('weight', filters.minWeight);
        }
        if (filters.maxWeight) {
          console.log("Applying maxWeight filter:", filters.maxWeight);
          query = query.lte('weight', filters.maxWeight);
        }
      }

      // Add order and pagination
      query = query
        .order("created_at", { ascending: false })
        .range(from, to);

      console.log("Executing query...");
      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching advertisements:", error);
        toast.error("Erro ao carregar anúncios");
        throw error;
      }

      console.log("Query results:", { 
        resultCount: data?.length || 0,
        totalCount: count,
        firstResult: data?.[0]
      });

      // Process the data to get only the latest review for each ad
      const processedData = data?.map(ad => ({
        ...ad,
        advertisement_reviews: ad.advertisement_reviews?.length > 0 
          ? [ad.advertisement_reviews.reduce((latest, current) => 
              new Date(current.updated_at) > new Date(latest.updated_at) ? current : latest
            )]
          : []
      }));

      return {
        data: processedData as Advertisement[],
        count,
        nextPage: processedData?.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0
  });
};