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
import { Eye, MapPin, Calendar, Ruler, Scale } from "lucide-react";
import { ServicesSelection } from "./ServicesSelection";
import { ServiceLocations } from "./ServiceLocations";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type AdvertisementDialogProps = {
  advertisement: any;
  onOpenChange: (open: boolean) => void;
};

export const AdvertisementDialog = ({ advertisement, onOpenChange }: AdvertisementDialogProps) => {
  const queryClient = useQueryClient();

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
      const recordView = async () => {
        await supabase
          .from("advertisement_views")
          .insert({ advertisement_id: advertisement.id });
        
        queryClient.invalidateQueries({
          queryKey: ["advertisement-views", advertisement.id],
        });
      };

      recordView();
    }
  }, [advertisement, queryClient]);

  const handleWhatsAppClick = async () => {
    if (advertisement) {
      await supabase
        .from("advertisement_whatsapp_clicks")
        .insert({ advertisement_id: advertisement.id });
      
      queryClient.invalidateQueries({
        queryKey: ["profile-whatsapp-clicks", advertisement.id],
      });

      const whatsappUrl = `https://wa.me/${advertisement.whatsapp}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (!advertisement) return null;

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <Dialog open={!!advertisement} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto glass-card">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {advertisement.name}
          </DialogTitle>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{advertisement.neighborhood}, {advertisement.city} - {advertisement.state}</span>
          </div>
        </DialogHeader>
        
        <div className="space-y-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Coluna da Esquerda - Mídia e Informações Básicas */}
            <div className="space-y-6">
              <AdvertisementMedia
                profilePhotoUrl={advertisement.profile_photo_url}
                photos={advertisement.advertisement_photos}
                videos={advertisement.advertisement_videos}
                name={advertisement.name}
              />

              {/* Informações Básicas */}
              <div className="glass-card p-6 space-y-4">
                <h2 className="text-xl font-semibold">Informações Básicas</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{calculateAge(advertisement.birth_date)} anos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-muted-foreground" />
                    <span>{advertisement.height}cm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-muted-foreground" />
                    <span>{advertisement.weight}kg</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Etnia</span>
                    <p className="capitalize">{advertisement.ethnicity}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Cabelo</span>
                    <p className="capitalize">{advertisement.hair_color}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Tipo Corporal</span>
                    <p className="capitalize">{advertisement.body_type}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Silicone</span>
                    <p className="capitalize">{advertisement.silicone.replace(/_/g, " ")}</p>
                  </div>
                </div>
              </div>

              {/* Serviços */}
              <div className="glass-card p-6 space-y-4">
                <h2 className="text-xl font-semibold">Serviços</h2>
                <ServicesSelection services={advertisement.advertisement_services} />
              </div>

              {/* Locais de Atendimento */}
              <div className="glass-card p-6 space-y-4">
                <h2 className="text-xl font-semibold">Locais de Atendimento</h2>
                <ServiceLocations locations={advertisement.advertisement_service_locations} />
              </div>
            </div>

            {/* Coluna da Direita - Detalhes e Descrição */}
            <div className="space-y-6">
              <div className="glass-card p-6">
                <AdvertisementDetails 
                  advertisement={advertisement}
                  onWhatsAppClick={handleWhatsAppClick}
                />
              </div>

              {/* Descrição */}
              <div className="glass-card p-6 space-y-4">
                <h2 className="text-xl font-semibold">Sobre</h2>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {advertisement.description}
                </p>
              </div>

              {/* Comentários */}
              <div className="glass-card p-6 space-y-4">
                <h2 className="text-xl font-semibold">Comentários</h2>
                <AdvertisementComments advertisementId={advertisement.id} />
              </div>
            </div>
          </div>

          {/* Contador de Visualizações */}
          <div className="flex items-center justify-end gap-2 text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span className="text-sm">{viewCount} visualizações</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};