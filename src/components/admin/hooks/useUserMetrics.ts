import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DateFilter } from "../types";

export const useUserMetrics = (dateFilter?: DateFilter) => {
  return useQuery({
    queryKey: ["admin-user-metrics", dateFilter],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role, created_at")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (!data) {
          return {
            totalUsers: 0,
            activeUsers: 0,
            inactiveUsers: 0,
            advertisers: 0,
            clients: 0,
            admins: 0,
            previousPeriod: {
              totalUsers: 0,
              activeUsers: 0
            }
          };
        }

        const activeUsers = data.filter(user => {
          const lastActivity = new Date(user.created_at);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return lastActivity >= thirtyDaysAgo;
        }).length;

        return {
          totalUsers: data.length,
          activeUsers,
          inactiveUsers: data.length - activeUsers,
          advertisers: data.filter(user => user.role === 'anunciante').length,
          clients: data.filter(user => user.role === 'cliente').length,
          admins: data.filter(user => user.role === 'admin').length,
          previousPeriod: {
            totalUsers: data.length,
            activeUsers
          }
        };
      } catch (error) {
        console.error("Error fetching user metrics:", error);
        toast.error("Erro ao carregar métricas de usuários");
        throw error;
      }
    },
  });
};