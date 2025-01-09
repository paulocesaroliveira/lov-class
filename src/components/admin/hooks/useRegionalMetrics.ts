import { useQuery } from "@tanstack/react-query";
import { RegionalMetric } from "../types/metrics";
import { supabase } from "@/integrations/supabase/client";

type RegionalMetricsParams = {
  start_date: string | null;
  end_date: string | null;
};

type RegionalMetricsResponse = RegionalMetric[];

export const useRegionalMetrics = () => {
  return useQuery<RegionalMetricsResponse>({
    queryKey: ["regional-metrics"],
    queryFn: async () => {
      console.log("Fetching regional metrics...");
      const { data, error } = await supabase.rpc<RegionalMetricsResponse>(
        'get_regional_metrics',
        {
          start_date: null,
          end_date: null
        }
      );

      if (error) {
        console.error("Error fetching regional metrics:", error);
        throw error;
      }

      return data || [];
    },
  });
};