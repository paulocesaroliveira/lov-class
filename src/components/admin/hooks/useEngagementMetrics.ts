import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateFilter, EngagementMetrics } from "../types/metrics";

export const useEngagementMetrics = (dateFilter?: DateFilter) => {
  return useQuery<EngagementMetrics>({
    queryKey: ["engagement-metrics", dateFilter],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_engagement_metrics');

      if (error) throw error;

      const metrics = data || [];
      let filteredMetrics = metrics;

      if (dateFilter?.startDate) {
        filteredMetrics = filteredMetrics.filter(
          metric => metric.date >= dateFilter.startDate!
        );
      }

      if (dateFilter?.endDate) {
        filteredMetrics = filteredMetrics.filter(
          metric => metric.date <= dateFilter.endDate!
        );
      }

      return {
        metrics: filteredMetrics
      };
    },
  });
};