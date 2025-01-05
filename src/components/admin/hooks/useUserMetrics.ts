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

      if (error) {
        console.error("Error fetching user metrics:", error);
        throw error;
      }

      // Transform the RPC response into the expected format
      const dashboardMetrics: DashboardMetrics = {
        totalUsers: data.reduce((sum: number, m: any) => sum + Number(m.total_users), 0),
        activeUsers: data.reduce((sum: number, m: any) => sum + Number(m.active_users_7d), 0),
        inactiveUsers: data.reduce((sum: number, m: any) => 
          sum + (Number(m.total_users) - Number(m.active_users_7d)), 0)
      };

      return dashboardMetrics;
    },
  });
};