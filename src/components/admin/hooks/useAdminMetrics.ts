import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CountResponse {
  count: number | null;
}

interface AdStatusCount {
  status: string;
  count: number;
}

export const useAdminMetrics = () => {
  // Métricas de usuários
  const { data: userMetrics } = useQuery({
    queryKey: ["admin-user-metrics"],
    queryFn: async () => {
      const { count: totalUsers } = (await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })) as { count: number };

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: activeUsers } = (await supabase
        .from("user_activity_logs")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgo.toISOString())) as { count: number };

      return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        inactiveUsers: (totalUsers || 0) - (activeUsers || 0),
      };
    },
  });

  // Métricas de anúncios
  const { data: adMetrics } = useQuery({
    queryKey: ["admin-ad-metrics"],
    queryFn: async () => {
      const { data: adStatusCount } = await supabase
        .from("advertisement_review_counts")
        .select("*")
        .throwOnError();

      const statusCount = {
        pending: 0,
        approved: 0,
        rejected: 0,
      };

      adStatusCount?.forEach((item: AdStatusCount) => {
        if (item.status in statusCount) {
          statusCount[item.status as keyof typeof statusCount] = item.count;
        }
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