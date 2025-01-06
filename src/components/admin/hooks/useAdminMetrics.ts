import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { DateFilter } from "../types/metrics";

interface AdMetricsResponse {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  approvalRate: number;
}

export const useAdminMetrics = (dateFilter?: DateFilter) => {
  const { data: userMetrics } = useQuery({
    queryKey: ["admin-user-metrics", dateFilter],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (dateFilter?.startDate) {
        query = query.gte('created_at', dateFilter.startDate);
      }
      if (dateFilter?.endDate) {
        query = query.lte('created_at', dateFilter.endDate);
      }
      
      const { count: totalUsers } = await query;

      let activityQuery = supabase
        .from("user_activity_logs")
        .select("*", { count: "exact", head: true });

      if (dateFilter?.startDate) {
        activityQuery = activityQuery.gte('created_at', dateFilter.startDate);
      }
      if (dateFilter?.endDate) {
        activityQuery = activityQuery.lte('created_at', dateFilter.endDate);
      }

      const { count: activeUsers } = await activityQuery;

      return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        inactiveUsers: (totalUsers || 0) - (activeUsers || 0),
      };
    },
  });

  const { data: adMetrics } = useQuery({
    queryKey: ["admin-ad-metrics", dateFilter],
    queryFn: async () => {
      let query = supabase
        .from("advertisement_reviews")
        .select("*");

      if (dateFilter?.startDate) {
        query = query.gte('created_at', dateFilter.startDate);
      }
      if (dateFilter?.endDate) {
        query = query.lte('created_at', dateFilter.endDate);
      }

      const { data: reviews, error } = await query;

      if (error) throw error;

      const total = reviews?.length || 0;
      const approved = reviews?.filter(r => r.status === 'approved').length || 0;
      const pending = reviews?.filter(r => r.status === 'pending').length || 0;
      const rejected = reviews?.filter(r => r.status === 'rejected').length || 0;
      const approvalRate = total > 0 ? (approved / total) * 100 : 0;

      return {
        total,
        approved,
        pending,
        rejected,
        approvalRate,
      } as AdMetricsResponse;
    },
  });

  // Métricas de engajamento ao longo do tempo
  const { data: engagementMetrics } = useQuery({
    queryKey: ["admin-engagement-metrics", dateFilter],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_engagement_metrics');

      if (error) throw error;

      let filteredData = data;
      if (dateFilter?.startDate) {
        filteredData = filteredData.filter((d: any) => d.date >= dateFilter.startDate);
      }
      if (dateFilter?.endDate) {
        filteredData = filteredData.filter((d: any) => d.date <= dateFilter.endDate);
      }

      return filteredData;
    },
  });

  // Métricas regionais
  const { data: regionalMetrics } = useQuery({
    queryKey: ["admin-regional-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_regional_metrics');

      if (error) throw error;
      return data;
    },
  });

  return {
    userMetrics,
    adMetrics,
    engagementMetrics,
    regionalMetrics,
  };
};