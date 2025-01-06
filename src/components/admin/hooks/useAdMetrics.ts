import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdvertisementReviewCount } from "../types/metrics";

interface DateFilter {
  startDate?: string;
  endDate?: string;
}

export const useAdMetrics = (dateFilter?: DateFilter) => {
  return useQuery({
    queryKey: ["admin-ad-metrics", dateFilter],
    queryFn: async () => {
      const { data: currentData, error } = await supabase
        .from('advertisement_reviews')
        .select('status, count(*)')
        .match(dateFilter || {})
        .group('status');

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

      const { data: previousData } = await supabase
        .from('advertisement_reviews')
        .select('status, count(*)')
        .match(previousStartDate && previousEndDate ? {
          created_at: `[${previousStartDate.toISOString()},${previousEndDate.toISOString()}]`
        } : {})
        .group('status');

      const processMetrics = (data: any[]) => {
        const total = data?.reduce((sum, item) => sum + Number(item.count), 0) || 0;
        const approved = data?.find(item => item.status === 'approved')?.count || 0;
        const pending = data?.find(item => item.status === 'pending')?.count || 0;
        const rejected = data?.find(item => item.status === 'rejected')?.count || 0;
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
      };
    },
  });
};