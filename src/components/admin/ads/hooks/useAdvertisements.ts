import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdvertisements = () => {
  return useQuery({
    queryKey: ["admin-advertisements"],
    queryFn: async () => {
      console.log("Fetching advertisements...");
      
      const { data, error } = await supabase
        .from("advertisements")
        .select(`
          *,
          profiles (
            name,
            role
          ),
          advertisement_reviews (
            moderation_status,
            review_notes,
            updated_at
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching advertisements:", error);
        throw error;
      }

      console.log("Fetched advertisements:", data);

      // Process the data to get only the latest review for each ad
      return data?.map(ad => ({
        ...ad,
        advertisement_reviews: ad.advertisement_reviews?.length > 0 
          ? [ad.advertisement_reviews.reduce((latest, current) => 
              new Date(current.updated_at) > new Date(latest.updated_at) ? current : latest
            )]
          : []
      }));
    },
  });
};