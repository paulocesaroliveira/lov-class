import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DateFilter {
  startDate?: string;
  endDate?: string;
}

export const useEngagementMetrics = (dateFilter?: DateFilter) => {
  return useQuery({
    queryKey: ["admin-engagement-metrics", dateFilter],
    queryFn: async () => {
      let query = supabase
        .from("advertisement_engagement_metrics")
        .select("*")
        .order("date", { ascending: true });

      if (dateFilter?.startDate) {
        query = query.gte('date', dateFilter.startDate);
      }
      if (dateFilter?.endDate) {
        query = query.lte('date', dateFilter.endDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};