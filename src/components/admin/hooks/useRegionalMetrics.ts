import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RegionalMetrics } from "../types/metrics";

export const useRegionalMetrics = () => {
  return useQuery<RegionalMetrics, Error>({
    queryKey: ["regional-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("advertisements")
        .select(`
          state,
          city,
          view_count:advertisement_views(count),
          click_count:advertisement_whatsapp_clicks(count)
        `)
        .not('status', 'eq', 'bloqueado')
        .order('state', 'city');

      if (error) {
        throw error;
      }

      return {
        metrics: data || []
      };
    },
  });
};