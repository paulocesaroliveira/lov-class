import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateFilter } from "../types/metrics";

export const useAdMetrics = (dateFilter?: DateFilter) => {
  return useQuery({
    queryKey: ["admin-ad-metrics", dateFilter],
    queryFn: async () => {
      let query = supabase
        .from('advertisement_reviews')
        .select('*');

      if (dateFilter?.startDate) {
        query = query.gte('created_at', dateFilter.startDate);
      }
      if (dateFilter?.endDate) {
        query = query.lte('created_at', dateFilter.endDate);
      }

      const { data: reviews, error } = await query;

      if (error) throw error;

      // Calculate metrics
      const total = reviews?.length || 0;
      const approved = reviews?.filter(r => r.status === 'approved').length || 0;
      const pending = reviews?.filter(r => r.status === 'pending').length || 0;
      const rejected = reviews?.filter(r => r.status === 'rejected').length || 0;
      const approvalRate = total > 0 ? (approved / total) * 100 : 0;

      // Get previous period metrics if date filter is provided
      let previousData = [];
      if (dateFilter?.startDate && dateFilter?.endDate) {
        const startDate = new Date(dateFilter.startDate);
        const endDate = new Date(dateFilter.endDate);
        const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        
        const previousEndDate = new Date(startDate);
        previousEndDate.setDate(previousEndDate.getDate() - 1);
        const previousStartDate = new Date(previousEndDate);
        previousStartDate.setDate(previousStartDate.getDate() - daysDiff);

        const { data: prevReviews } = await supabase
          .from('advertisement_reviews')
          .select('*')
          .gte('created_at', previousStartDate.toISOString())
          .lte('created_at', previousEndDate.toISOString());

        previousData = prevReviews || [];
      }

      const prevTotal = previousData.length;
      const prevApproved = previousData.filter((r: any) => r.status === 'approved').length;
      const prevPending = previousData.filter((r: any) => r.status === 'pending').length;
      const prevRejected = previousData.filter((r: any) => r.status === 'rejected').length;
      const prevApprovalRate = prevTotal > 0 ? (prevApproved / prevTotal) * 100 : 0;

      return {
        current: {
          total,
          approved,
          pending,
          rejected,
          approvalRate
        },
        previous: {
          total: prevTotal,
          approved: prevApproved,
          pending: prevPending,
          rejected: prevRejected,
          approvalRate: prevApprovalRate
        }
      };
    },
  });
};