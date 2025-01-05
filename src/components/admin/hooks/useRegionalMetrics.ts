import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useRegionalMetrics = () => {
  return useQuery({
    queryKey: ["admin-regional-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("regional_activity_metrics")
        .select("*");

      if (error) throw error;
      return data;
    },
  });
};