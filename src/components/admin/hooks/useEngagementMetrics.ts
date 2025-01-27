import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EngagementMetrics, DateFilter } from "../types/metrics";

export const useEngagementMetrics = (dateFilter?: DateFilter) => {
  return useQuery<EngagementMetrics>({
    queryKey: ["engagement-metrics", dateFilter],
    queryFn: async () => {
      let query = supabase.rpc('get_engagement_metrics');

      if (dateFilter?.startDate) {
        query = query.gte('date', dateFilter.startDate);
      }
      if (dateFilter?.endDate) {
        query = query.lte('date', dateFilter.endDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        metrics: data || []
      };
    },
  });
};