import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateFilter, AdMetricsResponse } from "../types/metrics";

export const useAdMetrics = (dateFilter?: DateFilter) => {
  return useQuery({
    queryKey: ["admin-ad-metrics", dateFilter],
    queryFn: async () => {
      const query = supabase
        .from('advertisement_reviews')
        .select('status, count')
        .eq('status', 'approved');

      if (dateFilter?.startDate) {
        query.gte('created_at', dateFilter.startDate);
      }
      if (dateFilter?.endDate) {
        query.lte('created_at', dateFilter.endDate);
      }

      const { data: currentData, error } = await query;

      if (error) throw error;

      // Calculate previous period metrics
      let previousStartDate, previousEndDate;
      if (dateFilter?.startDate && dateFilter?.endDate) {
        const currentStart = new Date(dateFilter.startDate);
        const currentEnd = new Date(dateFilter.endDate);
        const daysDiff = (currentEnd.getTime() - currentStart.getTime()) / (1000 * 60 * 60 * 24);
        
        previousEndDate = new Date(currentStart);
        previousEndDate.setDate(previousEndDate.getDate() - 1);
        previousStartDate = new Date(previousEndDate);
        previousStartDate.setDate(previousStartDate.getDate() - daysDiff);
      }

      const previousQuery = supabase
        .from('advertisement_reviews')
        .select('status, count');

      if (previousStartDate && previousEndDate) {
        previousQuery
          .gte('created_at', previousStartDate.toISOString())
          .lte('created_at', previousEndDate.toISOString());
      }

      const { data: previousData } = await previousQuery;

      const processMetrics = (data: any[]) => {
        const total = data?.length || 0;
        const approved = data?.filter(item => item.status === 'approved').length || 0;
        const pending = data?.filter(item => item.status === 'pending').length || 0;
        const rejected = data?.filter(item => item.status === 'rejected').length || 0;
        const approvalRate = total > 0 ? (approved / total) * 100 : 0;

        return {
          total,
          approved,
          pending,
          rejected,
          approvalRate
        };
      };

      return {
        current: processMetrics(currentData || []),
        previous: processMetrics(previousData || [])
      } as AdMetricsResponse;
    },
  });
};