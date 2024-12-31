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
      <div className="p-3 space-y-3">
        {/* Name - Centered */}
        <h3 className="text-lg font-semibold line-clamp-1 text-center">{advertisement.name}</h3>
        
        {/* Stats Row */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground justify-center">
          <div className="flex items-center gap-1">
            <Camera size={16} />
            <span>{advertisement.advertisement_photos?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Video size={16} />
            <span>{advertisement.advertisement_videos?.length || 0}</span>
          </div>
        </div>

        {/* Age and City - Side by Side */}
        <div className="grid grid-cols-2 text-sm">
          <div className="flex items-center justify-center gap-1">
            <span>{new Date().getFullYear() - new Date(advertisement.birth_date).getFullYear()} anos</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <MapPin size={16} className="text-muted-foreground" />
            <span>{advertisement.city}</span>
          </div>
        </div>

        {/* Height and Weight - Side by Side */}
        <div className="grid grid-cols-2 text-sm">
          <div className="flex items-center justify-center gap-1">
            <span className="text-muted-foreground">Altura:</span>
            <span>{advertisement.height}cm</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-muted-foreground">Peso:</span>
            <span>{advertisement.weight}kg</span>
          </div>
        </div>

        {/* Price - Centered */}
        <div className="text-lg font-bold text-center">
          R$ {advertisement.hourly_rate}
        </div>
      </div>
    </Card>
  );
};