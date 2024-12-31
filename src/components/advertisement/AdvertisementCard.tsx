import { Card } from "@/components/ui/card";
import { Camera, MapPin, Video } from "lucide-react";

interface AdvertisementCardProps {
  advertisement: any;
  onClick: () => void;
}

export const AdvertisementCard = ({ advertisement, onClick }: AdvertisementCardProps) => {
  const hasLocalService = advertisement.advertisement_service_locations?.some(
    (location: { location: string }) => location.location === "com_local"
  );

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* Image Container with 3:4 aspect ratio */}
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

      {/* Content Container with tighter spacing */}
      <div className="p-2 space-y-2">
        {/* Name */}
        <h3 className="text-base font-semibold line-clamp-1 text-center mb-1">{advertisement.name}</h3>

        {/* Info Grid - 2 columns */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
          {/* Age and Location */}
          <div className="flex items-center justify-center">
            <span>{new Date().getFullYear() - new Date(advertisement.birth_date).getFullYear()} anos</span>
          </div>
          <div className="flex items-center justify-center gap-0.5">
            <MapPin size={14} className="text-muted-foreground" />
            <span className="truncate">{advertisement.city}</span>
          </div>

          {/* Height and Weight */}
          <div className="flex items-center justify-center gap-1">
            <span className="text-muted-foreground">Alt:</span>
            <span>{advertisement.height}cm</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-muted-foreground">Peso:</span>
            <span>{advertisement.weight}kg</span>
          </div>

          {/* Style and Local Service */}
          <div className="flex items-center justify-center gap-1">
            <span className="text-muted-foreground">Estilo:</span>
            <span className="capitalize truncate">{advertisement.style}</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-muted-foreground">Local:</span>
            <span>{hasLocalService ? "Sim" : "Não"}</span>
          </div>
        </div>

        {/* Price */}
        <div className="text-base font-bold text-center py-1">
          R$ {advertisement.hourly_rate}
        </div>

        {/* Media Stats */}
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