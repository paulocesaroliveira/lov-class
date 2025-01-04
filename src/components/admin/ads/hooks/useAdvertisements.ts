import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdvertisements = () => {
  return useQuery({
    queryKey: ["admin-advertisements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("advertisements")
        .select(`
          *,
          profiles (
            name,
            role
          ),
          advertisement_reviews (
            status,
            review_notes,
            updated_at
          )
        `)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      // Processar os dados para pegar apenas a revisão mais recente de cada anúncio
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