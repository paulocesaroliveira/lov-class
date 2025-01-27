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
          city,
          view_count:advertisement_views(count),
          click_count:advertisement_whatsapp_clicks(count),
          active_ads:count()
        `)
        .not('status', 'eq', 'bloqueado')
        .order('city');

      if (error) {
        throw error;
      }

      return {
        metrics: data?.map(row => ({
          state: 'N/A', // Since state is not in the database yet
          city: row.city || 'N/A',
          view_count: Number(row.view_count),
          click_count: Number(row.click_count),
          active_ads: Number(row.active_ads)
        })) || []
      };
    },
  });
};