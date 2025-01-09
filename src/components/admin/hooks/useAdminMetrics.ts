import { useQuery } from "@tanstack/react-query";
import { DateFilter, AdminMetric, EngagementMetric } from "../types/metrics";
import { supabase } from "@/integrations/supabase/client";

type AdminMetricsParams = {
  start_date: string | null;
  end_date: string | null;
};

type AdminMetricsResponse = AdminMetric[];
type EngagementMetricsResponse = EngagementMetric[];

export const useAdminMetrics = (dateFilter?: DateFilter) => {
  const { data: engagementMetrics } = useQuery<EngagementMetricsResponse>({
    queryKey: ["admin-engagement-metrics", dateFilter],
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

  const { data: adminMetrics } = useQuery<AdminMetricsResponse>({
    queryKey: ["admin-metrics", dateFilter],
    queryFn: async () => {
      const { data, error } = await supabase.rpc<AdminMetricsResponse>(
        'get_admin_metrics',
        {
          start_date: dateFilter?.startDate || null,
          end_date: dateFilter?.endDate || null
        }
      );

      if (error) throw error;
      return data || [];
    },
  });

  return { engagementMetrics, adminMetrics };
};
