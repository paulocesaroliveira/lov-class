import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RegionalMetric } from "../types/metrics";

export const useRegionalMetrics = () => {
  return useQuery({
    queryKey: ["admin-regional-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('advertisements')
        .select(`
          state,
          city,
          view_count:advertisement_views(count),
          click_count:advertisement_whatsapp_clicks(count),
          active_ads:count(*)
        `)
        .eq('status', 'approved')
        .group('state, city');

      if (error) throw error;
      return data as RegionalMetric[];
    },
  });
};