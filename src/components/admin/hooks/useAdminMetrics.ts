import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminMetrics = () => {
  // Métricas de usuários
  const { data: userMetrics } = useQuery({
    queryKey: ["admin-user-metrics"],
    queryFn: async () => {
      const { data: totalUsers } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: activeUsers } = await supabase
        .from("user_activity_logs")
        .select("user_id", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgo.toISOString());

      return {
        totalUsers: totalUsers?.count || 0,
        activeUsers: activeUsers?.count || 0,
        inactiveUsers: (totalUsers?.count || 0) - (activeUsers?.count || 0),
      };
    },
  });

  // Métricas de anúncios
  const { data: adMetrics } = useQuery({
    queryKey: ["admin-ad-metrics"],
    queryFn: async () => {
      const { data: adStatusCount } = await supabase
        .from("advertisement_reviews")
        .select(`
          status,
          count
        `)
        .in("status", ["pending", "approved", "rejected"])
        .throwOnError();

      const statusCount = {
        pending: 0,
        approved: 0,
        rejected: 0,
      };

      adStatusCount?.forEach((item: any) => {
        statusCount[item.status as keyof typeof statusCount] = item.count;
      });

      const total = Object.values(statusCount).reduce((a, b) => a + b, 0);
      const approvalRate = total > 0 ? (statusCount.approved / total) * 100 : 0;
      const rejectionRate = total > 0 ? (statusCount.rejected / total) * 100 : 0;

      return {
        ...statusCount,
        total,
        approvalRate,
        rejectionRate,
      };
    },
  });

  return {
    userMetrics,
    adMetrics,
  };
};