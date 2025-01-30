import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateFilter } from "../types/metrics";

interface AdMetricsResponse {
  current: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    approvalRate: number;
  };
  previous?: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    approvalRate: number;
  };
}

export const useAdMetrics = (dateFilter?: DateFilter) => {
  return useQuery({
    queryKey: ["ad-metrics", dateFilter],
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
      const approved = reviews?.filter(r => r.moderation_status === 'approved').length || 0;
      const pending = reviews?.filter(r => r.moderation_status === 'pending_review').length || 0;
      const rejected = reviews?.filter(r => r.moderation_status === 'rejected').length || 0;
      const approvalRate = total > 0 ? (approved / total) * 100 : 0;

      // Get previous period metrics if date filter is provided
      let previousData: any[] = [];
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
      const prevApproved = previousData.filter((r: any) => r.moderation_status === 'approved').length;
      const prevPending = previousData.filter((r: any) => r.moderation_status === 'pending_review').length;
      const prevRejected = previousData.filter((r: any) => r.moderation_status === 'rejected').length;
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
      } as AdMetricsResponse;
    },
  });
};