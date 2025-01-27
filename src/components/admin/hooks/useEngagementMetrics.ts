import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateFilter, EngagementMetrics } from "../types/metrics";

export const useEngagementMetrics = (dateFilter?: DateFilter) => {
  return useQuery<EngagementMetrics>({
    queryKey: ["engagement-metrics", dateFilter],
    queryFn: async () => {
      const query = supabase
        .from("advertisement_views")
        .select(`
          date:created_at::date,
          unique_views:count(distinct id),
          total_views:count(id),
          whatsapp_clicks:count(id) filter (where exists (
            select 1 from advertisement_whatsapp_clicks awc 
            where awc.advertisement_id = advertisement_views.advertisement_id
          ))
        `)
        .group('created_at::date')
        .order('created_at::date');

      if (dateFilter?.startDate) {
        query.gte('created_at', dateFilter.startDate);
      }
      if (dateFilter?.endDate) {
        query.lte('created_at', dateFilter.endDate);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return {
        metrics: data || []
      };
    },
  });
};