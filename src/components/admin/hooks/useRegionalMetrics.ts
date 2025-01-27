import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RegionalMetrics } from "../types/metrics";

export const useRegionalMetrics = () => {
  return useQuery<RegionalMetrics>({
    queryKey: ["regional-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_regional_metrics');

      if (error) throw error;

      return {
        metrics: data || []
      };
    },
  });
};