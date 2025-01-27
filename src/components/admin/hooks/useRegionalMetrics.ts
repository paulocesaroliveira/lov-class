import { useQuery } from "@tanstack/react-query";
import { DateFilter, RegionalMetric } from "../types/metrics";
import { supabase } from "@/integrations/supabase/client";

export const useRegionalMetrics = (dateFilter?: DateFilter) => {
  return useQuery<RegionalMetric[], Error>({
    queryKey: ["regional-metrics", dateFilter],
    queryFn: async () => {
      const { data, error } = await supabase.rpc<RegionalMetric[]>(
        'get_regional_metrics',
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