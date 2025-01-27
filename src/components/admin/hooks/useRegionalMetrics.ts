import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface RegionalMetric {
  city: string;
  view_count: number;
  click_count: number;
  active_ads: number;
}

export const useRegionalMetrics = () => {
  return useQuery({
    queryKey: ["regional-metrics"],
    queryFn: async (): Promise<RegionalMetric[]> => {
      const { data, error } = await supabase.rpc("get_regional_metrics");
      
      if (error) throw error;
      return data;
    }
  });
};