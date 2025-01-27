import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EngagementMetrics {
  views: number;
  clicks: number;
  favorites: number;
}

export const useEngagementMetrics = () => {
  return useQuery<EngagementMetrics, Error>({
    queryKey: ["engagement-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("engagement_metrics")
        .select("views, clicks, favorites")
        .single();

      if (error) {
        console.error("Error fetching engagement metrics:", error);
        throw error;
      }

      return data as EngagementMetrics;
    },
  });
};
