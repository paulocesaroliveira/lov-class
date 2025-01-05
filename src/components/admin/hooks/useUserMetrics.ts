import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DateFilter {
  startDate?: string;
  endDate?: string;
}

export const useUserMetrics = (dateFilter?: DateFilter) => {
  return useQuery({
    queryKey: ["admin-user-metrics", dateFilter],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (dateFilter?.startDate) {
        query = query.gte('created_at', dateFilter.startDate);
      }
      if (dateFilter?.endDate) {
        query = query.lte('created_at', dateFilter.endDate);
      }
      
      const { count: totalUsers } = await query;

      let activityQuery = supabase
        .from("user_activity_logs")
        .select("*", { count: "exact", head: true });

      if (dateFilter?.startDate) {
        activityQuery = activityQuery.gte('created_at', dateFilter.startDate);
      }
      if (dateFilter?.endDate) {
        activityQuery = activityQuery.lte('created_at', dateFilter.endDate);
      }

      const { count: activeUsers } = await activityQuery;

      return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        inactiveUsers: (totalUsers || 0) - (activeUsers || 0),
      };
    },
  });
};