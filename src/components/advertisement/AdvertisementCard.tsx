import { Card } from "@/components/ui/card";
import { Camera, MapPin, Video, Heart } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!session) {
      toast.error("Faça login para favoritar anúncios");
      return;
    }

    setIsLoading(true);
    try {
      if (favorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', session.user.id)
          .eq('advertisement_id', advertisement.id);

        if (error) throw error;
        setFavorite(false);
        toast.success("Removido dos favoritos");
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: session.user.id,
            advertisement_id: advertisement.id
          });

        if (error) {
          if (error.message?.includes('duplicate key value')) {
            toast.error("Anúncio já está nos favoritos");
            return;
          }
          throw error;
        }
        setFavorite(true);
        toast.success("Adicionado aos favoritos");
      }
    } catch (error: any) {
      toast.error("Erro ao atualizar favoritos");
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden relative"
      onClick={onClick}
    >
      {session && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background"
          onClick={toggleFavorite}
          disabled={isLoading}
        >
          <Heart
            className={`h-5 w-5 ${favorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
          />
        </Button>
      )}

      <div className="aspect-[3/4] relative">
        {advertisement.profile_photo_url ? (
          <img
            src={`https://keqcfrpqctyfxpfoxrkp.supabase.co/storage/v1/object/public/profile_photos/${advertisement.profile_photo_url}`}
            alt={advertisement.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground">Sem foto</span>
          </div>
        )}
      </div>

      <div className="p-2 space-y-2">
        <h3 className="text-base font-semibold line-clamp-1 text-center mb-1">{advertisement.name}</h3>

        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
          <div className="flex items-center justify-center">
            <span>{new Date().getFullYear() - new Date(advertisement.birth_date).getFullYear()} anos</span>
          </div>
          <div className="flex items-center justify-center gap-0.5">
            <MapPin size={14} className="text-muted-foreground" />
            <span className="truncate">{advertisement.city}</span>
          </div>

          <div className="flex items-center justify-center gap-1">
            <span className="text-muted-foreground">Alt:</span>
            <span>{advertisement.height}cm</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-muted-foreground">Peso:</span>
            <span>{advertisement.weight}kg</span>
          </div>

          <div className="flex items-center justify-center gap-1">
            <span className="text-muted-foreground">Estilo:</span>
            <span className="capitalize truncate">{advertisement.style}</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-muted-foreground">Local:</span>
            <span>{hasLocalService ? "Sim" : "Não"}</span>
          </div>
        </div>

        <div className="text-base font-bold text-center py-1">
          R$ {advertisement.hourly_rate}
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground justify-center border-t pt-1">
          <div className="flex items-center gap-0.5">
            <Camera size={14} />
            <span>{advertisement.advertisement_photos?.length || 0}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Video size={14} />
            <span>{advertisement.advertisement_videos?.length || 0}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};