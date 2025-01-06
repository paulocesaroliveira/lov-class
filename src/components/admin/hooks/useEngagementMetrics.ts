import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EngagementMetric } from "../types/metrics";

interface DateFilter {
  startDate?: string;
  endDate?: string;
}

export const useEngagementMetrics = (dateFilter?: DateFilter) => {
  return useQuery({
    queryKey: ["admin-engagement-metrics", dateFilter],
    queryFn: async () => {
      let query = supabase
        .from('advertisement_views')
        .select(`
          date:viewed_at::date,
          unique_views:count(distinct advertisement_id),
          total_views:count(*),
          whatsapp_clicks:count(distinct advertisement_whatsapp_clicks.id)
        `)
        .leftJoin('advertisement_whatsapp_clicks', 'advertisement_views.advertisement_id', 'advertisement_whatsapp_clicks.advertisement_id')
        .group('date')
        .order('date', { ascending: true });

      if (dateFilter?.startDate) {
        query = query.gte('viewed_at', dateFilter.startDate);
      }
      if (dateFilter?.endDate) {
        query = query.lte('viewed_at', dateFilter.endDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as EngagementMetric[];
    },
  });
};