import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RegionalMetric } from "../types/metrics";

interface RegionalMetricsParams {
  // Add any parameters your RPC function expects
}

export const useRegionalMetrics = () => {
  return useQuery({
    queryKey: ["regional-metrics"],
    queryFn: async () => {
      console.log("Fetching regional metrics...");
      const { data, error } = await supabase
        .rpc('get_regional_metrics', {} as RegionalMetricsParams);

      if (error) {
        console.error("Error fetching regional metrics:", error);
        throw error;
      }

      console.log("Regional metrics data:", data);
      return data as RegionalMetric[];
    },
  });
};