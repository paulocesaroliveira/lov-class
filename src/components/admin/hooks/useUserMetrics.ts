import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useUserMetrics = () => {
  return useQuery({
    queryKey: ["admin-user-metrics"],
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
            advertisers: 0,
            clients: 0,
            admins: 0,
          };
        }

        return {
          totalUsers: data.length,
          advertisers: data.filter(user => user.role === 'anunciante').length,
          clients: data.filter(user => user.role === 'cliente').length,
          admins: data.filter(user => user.role === 'admin').length,
        };
      } catch (error) {
        console.error("Error fetching user metrics:", error);
        toast.error("Erro ao carregar métricas de usuários");
        throw error;
      }
    },
  });
};