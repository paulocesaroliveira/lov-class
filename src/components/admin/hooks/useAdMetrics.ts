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
      // Consulta para o período atual
      let query = supabase
        .from("advertisement_review_counts")
        .select("*");

      if (dateFilter?.startDate) {
        query = query.gte('created_at', dateFilter.startDate);
      }
      if (dateFilter?.endDate) {
        query = query.lte('created_at', dateFilter.endDate);
      }

      const { data: currentData, error } = await query;

      if (error) throw error;

      // Calcular datas para o período anterior
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

      // Consulta para o período anterior
      let previousQuery = supabase
        .from("advertisement_review_counts")
        .select("*");

      if (previousStartDate) {
        previousQuery = previousQuery.gte('created_at', previousStartDate.toISOString());
      }
      if (previousEndDate) {
        previousQuery = previousQuery.lte('created_at', previousEndDate.toISOString());
      }

      const { data: previousData } = await previousQuery;

      // Processar dados atuais
      const total = currentData?.reduce((sum, item) => sum + (item.count || 0), 0) || 0;
      const approved = currentData?.find(item => item.status === 'approved')?.count || 0;
      const pending = currentData?.find(item => item.status === 'pending')?.count || 0;
      const rejected = currentData?.find(item => item.status === 'rejected')?.count || 0;
      const approvalRate = total > 0 ? (approved / total) * 100 : 0;

      // Processar dados anteriores
      const previousTotal = previousData?.reduce((sum, item) => sum + (item.count || 0), 0) || 0;
      const previousApproved = previousData?.find(item => item.status === 'approved')?.count || 0;
      const previousPending = previousData?.find(item => item.status === 'pending')?.count || 0;
      const previousRejected = previousData?.find(item => item.status === 'rejected')?.count || 0;
      const previousApprovalRate = previousTotal > 0 ? (previousApproved / previousTotal) * 100 : 0;

      return {
        current: {
          total,
          approved,
          pending,
          rejected,
          approvalRate
        },
        previous: {
          total: previousTotal,
          approved: previousApproved,
          pending: previousPending,
          rejected: previousRejected,
          approvalRate: previousApprovalRate
        }
      };
    },
  });
};