import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AdminMetrics {
  totalUsers: number;
  totalAds: number;
  totalReviews: number;
}

export const useAdminMetrics = () => {
  return useQuery<AdminMetrics, Error>({
    queryKey: ["admin-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id", { count: "exact" });

      if (error) {
        console.error("Error fetching total users:", error);
        throw error;
      }

      const totalUsers = data?.length || 0;

      const { data: adsData, error: adsError } = await supabase
        .from("advertisements")
        .select("id", { count: "exact" });

      if (adsError) {
        console.error("Error fetching total ads:", adsError);
        throw adsError;
      }

      const totalAds = adsData?.length || 0;

      const { data: reviewsData, error: reviewsError } = await supabase
        .from("advertisement_reviews")
        .select("id", { count: "exact" });

      if (reviewsError) {
        console.error("Error fetching total reviews:", reviewsError);
        throw reviewsError;
      }

      const totalReviews = reviewsData?.length || 0;

      return {
        totalUsers,
        totalAds,
        totalReviews,
      };
    },
  });
};
