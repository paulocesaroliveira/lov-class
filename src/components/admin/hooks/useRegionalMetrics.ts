import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface RegionalMetrics {
  byState: Record<string, number>;
  byCity: Record<string, number>;
}

export const useRegionalMetrics = () => {
  return useQuery<RegionalMetrics, Error>({
    queryKey: ["regional-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("advertisements")
        .select(`
          state,
          city,
          count(*) as count
        `)
        .group("state, city");

      if (error) {
        console.error("Error fetching regional metrics:", error);
        throw error;
      }

      const byState: Record<string, number> = {};
      const byCity: Record<string, number> = {};

      data?.forEach((item) => {
        byState[item.state] = (byState[item.state] || 0) + item.count;
        byCity[item.city] = (byCity[item.city] || 0) + item.count;
      });

      return { byState, byCity };
    },
  });
};
