import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DateFilter {
  startDate?: string;
  endDate?: string;
}

export const useAdMetrics = (dateFilter?: DateFilter) => {
  return useQuery({
    queryKey: ["admin-ad-metrics", dateFilter],
    queryFn: async () => {
      let query = supabase
        .from("advertisement_review_counts")
        .select("*");

      if (dateFilter?.startDate) {
        query = query.gte('created_at', dateFilter.startDate);
      }
      if (dateFilter?.endDate) {
        query = query.lte('created_at', dateFilter.endDate);
      }

      const { data: adStatusCount, error } = await query;

      if (error) throw error;

      const statusCount = {
        pending: 0,
        approved: 0,
        rejected: 0,
      };

      adStatusCount?.forEach((item: any) => {
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
};