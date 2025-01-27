import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RegionalMetrics } from "../types/metrics";

export const useRegionalMetrics = () => {
  return useQuery<RegionalMetrics>({
    queryKey: ["regional-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("advertisements")
        .select(`
          state,
          city,
          view_count:advertisement_views(count),
          click_count:advertisement_whatsapp_clicks(count),
          active_ads:count()
        `)
        .not('status', 'eq', 'bloqueado')
        .groupBy('state, city')
        .order('state', { ascending: true })
        .order('city', { ascending: true });

      if (error) {
        throw error;
      }

      return {
        metrics: data || []
      };
    },
  });
};