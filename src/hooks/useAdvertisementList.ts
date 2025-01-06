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
      console.log("Fetching advertisements with filters:", filters);
      
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
        .eq('blocked', false)
        .order("created_at", { ascending: false })
        .range(from, to);

      console.log("Generated query:", query);

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching advertisements:", error);
        toast.error("Erro ao carregar anúncios");
        throw error;
      }

      console.log("Fetched advertisements:", data);

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