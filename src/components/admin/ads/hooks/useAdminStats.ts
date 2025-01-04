import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      // Buscar anunciantes
      const { data: advertisers, error: advertiserError } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "advertiser");

      if (advertiserError) throw advertiserError;

      // Buscar anúncios pendentes (usando a revisão mais recente de cada anúncio)
      const { data: reviews, error: reviewError } = await supabase
        .from("advertisement_reviews")
        .select(`
          id,
          advertisement_id,
          status,
          updated_at
        `)
        .eq("status", "pending");

      if (reviewError) throw reviewError;

      // Filtrar para pegar apenas a revisão mais recente de cada anúncio
      const latestReviews = reviews?.reduce((acc, current) => {
        const existingReview = acc.find(r => r.advertisement_id === current.advertisement_id);
        if (!existingReview || new Date(current.updated_at) > new Date(existingReview.updated_at)) {
          return [...acc.filter(r => r.advertisement_id !== current.advertisement_id), current];
        }
        return acc;
      }, [] as typeof reviews);

      return {
        advertisers: advertisers?.length || 0,
        pendingReviews: latestReviews?.length || 0
      };
    },
  });
};