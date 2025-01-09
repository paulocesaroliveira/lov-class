import { useQuery } from "@tanstack/react-query";
import { DateFilter, EngagementMetric } from "../types/metrics";
import { supabase } from "@/integrations/supabase/client";

type EngagementMetricsParams = {
  start_date: string | null;
  end_date: string | null;
};

type EngagementMetricsResponse = EngagementMetric[];

export const useEngagementMetrics = (dateFilter?: DateFilter) => {
  return useQuery<EngagementMetricsResponse>({
    queryKey: ["engagement-metrics", dateFilter],
    queryFn: async () => {
      const { data, error } = await supabase.rpc<EngagementMetricsResponse>(
        'get_engagement_metrics',
        {
          start_date: dateFilter?.startDate || null,
          end_date: dateFilter?.endDate || null
        }
      );

      if (error) throw error;
      return data || [];
    },
  });
};