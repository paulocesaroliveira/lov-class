import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateFilter, EngagementMetric } from "../types/metrics";

export const useEngagementMetrics = (dateFilter?: DateFilter) => {
  return useQuery({
    queryKey: ["admin-engagement-metrics", dateFilter],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_engagement_metrics');

      if (error) throw error;

      // Filter data if date range is provided
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