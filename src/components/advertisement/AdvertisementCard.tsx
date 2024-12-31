import { Card } from "@/components/ui/card";
import { Camera, MapPin, Video } from "lucide-react";

interface AdvertisementCardProps {
  advertisement: any;
  onClick: () => void;
}

export const AdvertisementCard = ({ advertisement, onClick }: AdvertisementCardProps) => {
  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* Image Container */}
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

      {/* Content */}
      <div className="p-3 space-y-2">
        <h3 className="text-lg font-semibold line-clamp-1">{advertisement.name}</h3>
        
        {/* Stats Row */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Camera size={16} />
            <span>{advertisement.advertisement_photos?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Video size={16} />
            <span>{advertisement.advertisement_videos?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            <span>{advertisement.city}</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-1 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Idade:</span>
            <span>{new Date().getFullYear() - new Date(advertisement.birth_date).getFullYear()}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Altura:</span>
            <span>{advertisement.height}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Peso:</span>
            <span>{advertisement.weight}</span>
          </div>
        </div>

        {/* Price */}
        <div className="text-lg font-bold">
          R$ {advertisement.hourly_rate}
        </div>
      </div>
    </Card>
  );
};