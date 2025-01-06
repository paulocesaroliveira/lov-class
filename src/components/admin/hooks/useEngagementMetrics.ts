import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateFilter, EngagementMetric } from "../types/metrics";

export const useEngagementMetrics = (dateFilter?: DateFilter) => {
  return useQuery({
    queryKey: ["admin-engagement-metrics", dateFilter],
    queryFn: async () => {
      const query = supabase.rpc('get_engagement_metrics');

      if (dateFilter?.startDate) {
        query.gte('date', dateFilter.startDate);
      }
      if (dateFilter?.endDate) {
        query.lte('date', dateFilter.endDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as EngagementMetric[];
    },
  });
};