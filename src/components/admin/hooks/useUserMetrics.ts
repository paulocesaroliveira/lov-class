import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserMetrics } from "../types/history";

export const useUserMetrics = () => {
  return useQuery({
    queryKey: ["user-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_metrics")
        .select("*");

      if (error) throw error;
      return data as UserMetrics[];
    },
  });
};