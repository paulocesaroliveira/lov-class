import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdvertisementMedia } from "./AdvertisementMedia";
import { AdvertisementDetails } from "./AdvertisementDetails";
import { AdvertisementComments } from "./AdvertisementComments";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye } from "lucide-react";

type AdvertisementDialogProps = {
  advertisement: any;
  onOpenChange: (open: boolean) => void;
};

export const AdvertisementDialog = ({ advertisement, onOpenChange }: AdvertisementDialogProps) => {
  const queryClient = useQueryClient();

  // Query to get view count
  const { data: viewCount } = useQuery({
    queryKey: ["advertisement-views", advertisement?.id],
    queryFn: async () => {
      if (!advertisement?.id) return 0;
      
      const { count, error } = await supabase
        .from("advertisement_views")
        .select("*", { count: 'exact', head: true })
        .eq("advertisement_id", advertisement.id);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!advertisement?.id,
  });

  useEffect(() => {
    if (advertisement) {
      // Record view
      const recordView = async () => {
        await supabase
          .from("advertisement_views")
          .insert({ advertisement_id: advertisement.id });
        
        // Invalidate view count query to trigger refresh
        queryClient.invalidateQueries({
          queryKey: ["advertisement-views", advertisement.id],
        });
      };

      recordView();
    }
  }, [advertisement, queryClient]);

  const handleWhatsAppClick = async () => {
    if (advertisement) {
      // Record WhatsApp click
      await supabase
        .from("advertisement_whatsapp_clicks")
        .insert({ advertisement_id: advertisement.id });
      
      // Invalidate WhatsApp click count query to trigger refresh
      queryClient.invalidateQueries({
        queryKey: ["profile-whatsapp-clicks", advertisement.id],
      });

      // Open WhatsApp
      const whatsappUrl = `https://wa.me/${advertisement.whatsapp}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (!advertisement) return null;

  return (
    <Dialog open={!!advertisement} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{advertisement.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna da Esquerda - Mídia */}
            <AdvertisementMedia
              profilePhotoUrl={advertisement.profile_photo_url}
              photos={advertisement.advertisement_photos}
              videos={advertisement.advertisement_videos}
              name={advertisement.name}
            />

            {/* Coluna da Direita - Informações */}
            <AdvertisementDetails 
              advertisement={advertisement}
              onWhatsAppClick={handleWhatsAppClick}
            />
          </div>

          {/* Seção de Comentários */}
          <div className="border-t pt-6">
            <AdvertisementComments advertisementId={advertisement.id} />
          </div>

          {/* Contador de Visualizações */}
          <div className="border-t pt-4 flex items-center justify-end gap-2 text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span className="text-sm">{viewCount} visualizações</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};