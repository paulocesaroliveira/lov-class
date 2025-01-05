import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserMetrics, DashboardMetrics } from "../types/history";

interface DateFilter {
  startDate: string;
  endDate: string;
}

export const useUserMetrics = (dateFilter?: DateFilter) => {
  return useQuery({
    queryKey: ["user-metrics", dateFilter],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_user_metrics');

      if (error) throw error;

      const metrics = data as UserMetrics[];
      
      // Calculate dashboard metrics
      const dashboardMetrics: DashboardMetrics = {
        totalUsers: metrics.reduce((sum, m) => sum + m.total_users, 0),
        activeUsers: metrics.reduce((sum, m) => sum + m.active_users_7d, 0),
        inactiveUsers: metrics.reduce((sum, m) => sum + (m.total_users - m.active_users_7d), 0)
      };

      return dashboardMetrics;
    },
  });
};