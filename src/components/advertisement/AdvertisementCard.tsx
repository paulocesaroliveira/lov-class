import { Card } from "@/components/ui/card";
import { Camera, MapPin, Video, Heart, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

interface AdvertisementCardProps {
  advertisement: any;
  onClick: () => void;
  isFavorite?: boolean;
}

export const AdvertisementCard = ({ advertisement, onClick, isFavorite = false }: AdvertisementCardProps) => {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);

  const hasLocalService = advertisement.advertisement_service_locations?.some(
    (location: { location: string }) => location.location === "com_local"
  );

  const { data: favoriteData } = useQuery({
    queryKey: ["favorite", session?.user?.id, advertisement.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('advertisement_id', advertisement.id)
        .maybeSingle();
      
      return data;
    },
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!session) {
      toast.error("Faça login para favoritar anúncios");
      return;
    }

    setIsLoading(true);

    try {
      if (favorite) {
        const { error: deleteError } = await supabase
          .from('favorites')
          .delete()
          .eq('id', favoriteData?.id);

        if (deleteError) {
          console.error("Error removing favorite:", deleteError);
          toast.error("Erro ao remover dos favoritos");
          return;
        }

        setFavorite(false);
        toast.success("Removido dos favoritos");
      } else {
        const { error: insertError } = await supabase
          .from('favorites')
          .insert({
            user_id: session.user.id,
            advertisement_id: advertisement.id
          });

        if (insertError) {
          console.error("Error adding favorite:", insertError);
          toast.error("Erro ao adicionar aos favoritos");
          return;
        }

        setFavorite(true);
        toast.success("Adicionado aos favoritos");
      }
    } catch (error) {
      console.error("Error in toggleFavorite:", error);
      toast.error("Erro ao atualizar favoritos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card 
      className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden relative bg-background/95 backdrop-blur-sm border-border/50"
      onClick={onClick}
    >
      {session && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background backdrop-blur-sm shadow-sm"
          onClick={toggleFavorite}
          disabled={isLoading}
        >
          <Heart
            className={`h-5 w-5 transition-colors ${favorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground group-hover:text-red-500'}`}
          />
        </Button>
      )}

      <div className="aspect-[3/4] relative overflow-hidden">
        {advertisement.profile_photo_url ? (
          <img
            src={`https://keqcfrpqctyfxpfoxrkp.supabase.co/storage/v1/object/public/profile_photos/${advertisement.profile_photo_url}`}
            alt={advertisement.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/50 backdrop-blur-sm">
            <span className="text-muted-foreground">Sem foto</span>
          </div>
        )}
      </div>

      <div className="p-2 sm:p-3 space-y-2 sm:space-y-3">
        <h3 className="text-sm sm:text-base font-semibold line-clamp-1 text-center">{advertisement.name}</h3>

        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs sm:text-sm">
          <div className="flex items-center justify-center bg-muted/50 rounded-md py-1 px-1.5 sm:px-2">
            <span className="truncate">{new Date().getFullYear() - new Date(advertisement.birth_date).getFullYear()} anos</span>
          </div>
          <div className="flex items-center justify-center gap-1 bg-muted/50 rounded-md py-1 px-1.5 sm:px-2">
            <MapPin size={12} className="text-primary shrink-0" />
            <span className="truncate">{advertisement.city}</span>
          </div>

          <div className="flex items-center justify-center gap-1 bg-muted/50 rounded-md py-1 px-1.5 sm:px-2">
            <span className="text-primary shrink-0">Alt:</span>
            <span className="truncate">{advertisement.height}cm</span>
          </div>
          <div className="flex items-center justify-center gap-1 bg-muted/50 rounded-md py-1 px-1.5 sm:px-2">
            <span className="text-primary shrink-0">Peso:</span>
            <span className="truncate">{advertisement.weight}kg</span>
          </div>

          <div className="flex items-center justify-center gap-1 bg-muted/50 rounded-md py-1 px-1.5 sm:px-2">
            <span className="text-primary shrink-0">Estilo:</span>
            <span className="capitalize truncate">{advertisement.style}</span>
          </div>
          <div className="flex items-center justify-center gap-1 bg-muted/50 rounded-md py-1 px-1.5 sm:px-2">
            <span className="text-primary shrink-0">Local:</span>
            <span>{hasLocalService ? "Sim" : "Não"}</span>
          </div>
        </div>

        <div className="text-base sm:text-lg font-bold text-center py-1 sm:py-2 text-primary">
          R$ {advertisement.hourly_rate}
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground justify-center border-t border-border/50 pt-2">
          <div className="flex items-center gap-1 hover:text-primary transition-colors">
            <Camera size={12} className="shrink-0" />
            <span>{advertisement.advertisement_photos?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1 hover:text-primary transition-colors">
            <Video size={12} className="shrink-0" />
            <span>{advertisement.advertisement_videos?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1 hover:text-primary transition-colors">
            <MessageSquare size={12} className="shrink-0" />
            <span>{advertisement.advertisement_comments?.length || 0}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};