import { useQuery } from "@tanstack/react-query";
import { DateFilter, AdminMetric } from "../types/metrics";
import { supabase } from "@/integrations/supabase/client";

type AdminMetricsParams = {
  start_date: string | null;
  end_date: string | null;
};

export const useAdminMetrics = (dateFilter?: DateFilter) => {
  return useQuery<AdminMetric[], Error>({
    queryKey: ["admin-metrics", dateFilter],
    queryFn: async () => {
      const { data, error } = await supabase.rpc<AdminMetric[]>(
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
};