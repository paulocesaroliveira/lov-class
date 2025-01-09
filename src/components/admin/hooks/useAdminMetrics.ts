import { useQuery } from "@tanstack/react-query";
import { DateFilter, AdminMetric, EngagementMetric } from "../types/metrics";
import { supabase } from "@/integrations/supabase/client";

type AdminMetricsParams = {
  start_date: string | null;
  end_date: string | null;
};

export const useAdminMetrics = (dateFilter?: DateFilter) => {
  const { data: engagementMetrics } = useQuery<EngagementMetric[], Error>({
    queryKey: ["admin-engagement-metrics", dateFilter],
    queryFn: async () => {
      const { data, error } = await supabase.rpc<EngagementMetric[], AdminMetricsParams>(
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

  const { data: adminMetrics } = useQuery<AdminMetric[], Error>({
    queryKey: ["admin-metrics", dateFilter],
    queryFn: async () => {
      const { data, error } = await supabase.rpc<AdminMetric[], AdminMetricsParams>(
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