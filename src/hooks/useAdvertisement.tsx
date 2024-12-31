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
  });
};