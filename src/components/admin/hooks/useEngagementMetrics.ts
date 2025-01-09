import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateFilter, EngagementMetric } from "../types/metrics";

interface EngagementMetricsParams {
  start_date?: string;
  end_date?: string;
}

export const useEngagementMetrics = (dateFilter?: DateFilter) => {
  return useQuery({
    queryKey: ["engagement-metrics", dateFilter],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_engagement_metrics', {
          start_date: dateFilter?.startDate,
          end_date: dateFilter?.endDate
        } as EngagementMetricsParams);

      if (error) throw error;

      let filteredData = data as EngagementMetric[];
      if (dateFilter?.startDate) {
        filteredData = filteredData.filter(d => d.date >= dateFilter.startDate);
      }
      if (dateFilter?.endDate) {
        filteredData = filteredData.filter(d => d.date <= dateFilter.endDate);
      }

      return filteredData;
    },
  });
};