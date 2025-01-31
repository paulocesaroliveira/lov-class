import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useAdvertisementStats = (advertisementId: string | null) => {
  const { data: stats } = useQuery({
    queryKey: ['advertisement-stats', advertisementId],
    queryFn: async () => {
      if (!advertisementId) return null;

      const [viewsResponse, clicksResponse] = await Promise.all([
        supabase
          .from("advertisement_views")
          .select("created_at")
          .eq("advertisement_id", advertisementId),
        supabase
          .from("advertisement_whatsapp_clicks")
          .select("created_at")
          .eq("advertisement_id", advertisementId)
      ]);

      if (viewsResponse.error) {
        console.error("Error fetching views:", viewsResponse.error);
        return null;
      }

      if (clicksResponse.error) {
        console.error("Error fetching clicks:", clicksResponse.error);
        return null;
      }

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const monthlyViews = viewsResponse.data.filter(
        view => new Date(view.created_at) >= monthStart
      ).length;

      const monthlyClicks = clicksResponse.data.filter(
        click => new Date(click.created_at) >= monthStart
      ).length;

      return {
        totalViews: viewsResponse.data.length,
        monthlyViews,
        totalWhatsappClicks: clicksResponse.data.length,
        monthlyWhatsappClicks: monthlyClicks,
      };
    },
    enabled: !!advertisementId,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });

  return {
    totalViews: stats?.totalViews ?? 0,
    monthlyViews: stats?.monthlyViews ?? 0,
    totalWhatsappClicks: stats?.totalWhatsappClicks ?? 0,
    monthlyWhatsappClicks: stats?.monthlyWhatsappClicks ?? 0,
  };
};