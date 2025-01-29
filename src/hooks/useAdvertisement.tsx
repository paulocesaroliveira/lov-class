import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdvertisement = (id: string | undefined) => {
  return useQuery({
    queryKey: ["advertisement", id],
    queryFn: async () => {
      if (!id) return null;

      const { data: advertisement, error: adError } = await supabase
        .from("advertisements")
        .select(`
          *,
          advertisement_services (
            service
          ),
          advertisement_photos (
            photo_url
          ),
          advertisement_videos (
            video_url
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (adError) {
        toast.error("Erro ao carregar anúncio");
        throw adError;
      }

      return advertisement;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Função auxiliar para pegar o primeiro dia do mês atual
const getFirstDayOfCurrentMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
};

export const useAdvertisementStats = (advertisementId: string | null) => {
  // Total de visualizações
  const { data: totalViews } = useQuery({
    queryKey: ["profile-advertisement-views-total", advertisementId],
    queryFn: async () => {
      if (!advertisementId) return 0;
      
      const { count } = await supabase
        .from("advertisement_views")
        .select("*", { count: "exact", head: true })
        .eq("advertisement_id", advertisementId);
      
      return count || 0;
    },
    enabled: !!advertisementId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Visualizações do mês atual
  const { data: monthlyViews } = useQuery({
    queryKey: ["profile-advertisement-views-monthly", advertisementId],
    queryFn: async () => {
      if (!advertisementId) return 0;
      
      const { count } = await supabase
        .from("advertisement_views")
        .select("*", { count: "exact", head: true })
        .eq("advertisement_id", advertisementId)
        .gte("created_at", getFirstDayOfCurrentMonth()); // Changed from viewed_at to created_at
      
      return count || 0;
    },
    enabled: !!advertisementId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Total de cliques no WhatsApp
  const { data: totalWhatsappClicks } = useQuery({
    queryKey: ["profile-whatsapp-clicks-total", advertisementId],
    queryFn: async () => {
      if (!advertisementId) return 0;
      
      const { count } = await supabase
        .from("advertisement_whatsapp_clicks")
        .select("*", { count: "exact", head: true })
        .eq("advertisement_id", advertisementId);
      
      return count || 0;
    },
    enabled: !!advertisementId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Cliques no WhatsApp do mês atual
  const { data: monthlyWhatsappClicks } = useQuery({
    queryKey: ["profile-whatsapp-clicks-monthly", advertisementId],
    queryFn: async () => {
      if (!advertisementId) return 0;
      
      const { count } = await supabase
        .from("advertisement_whatsapp_clicks")
        .select("*", { count: "exact", head: true })
        .eq("advertisement_id", advertisementId)
        .gte("created_at", getFirstDayOfCurrentMonth()); // Changed from clicked_at to created_at
      
      return count || 0;
    },
    enabled: !!advertisementId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    totalViews,
    monthlyViews,
    totalWhatsappClicks,
    monthlyWhatsappClicks,
  };
};