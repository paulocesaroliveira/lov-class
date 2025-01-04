import { MediaViewer } from "./MediaViewer";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type AdvertisementMediaProps = {
  profilePhotoUrl?: string;
  photos?: { id: string; photo_url: string }[];
  videos?: { id: string; video_url: string }[];
  name: string;
};

export const AdvertisementMedia = ({ profilePhotoUrl, photos, videos, name }: AdvertisementMediaProps) => {
  const [selectedMedia, setSelectedMedia] = useState<{ type: "image" | "video"; url: string; index: number } | null>(null);

  const allMedia = [
    ...(profilePhotoUrl ? [{
      type: "image" as const,
      url: `https://keqcfrpqctyfxpfoxrkp.supabase.co/storage/v1/object/public/profile_photos/${profilePhotoUrl}`,
      id: "profile"
    }] : []),
    ...(photos?.map(photo => ({
      type: "image" as const,
      url: `https://keqcfrpqctyfxpfoxrkp.supabase.co/storage/v1/object/public/ad_photos/${photo.photo_url}`,
      id: photo.id
    })) || []),
    ...(videos?.map(video => ({
      type: "video" as const,
      url: `https://keqcfrpqctyfxpfoxrkp.supabase.co/storage/v1/object/public/ad_videos/${video.video_url}`,
      id: video.id
    })) || [])
  ];

  const handleMediaClick = (type: "image" | "video", url: string) => {
    const index = allMedia.findIndex(media => media.url === url);
    setSelectedMedia({ type, url, index });
  };

  const handleNext = () => {
    if (selectedMedia && selectedMedia.index < allMedia.length - 1) {
      const nextMedia = allMedia[selectedMedia.index + 1];
      setSelectedMedia({ 
        type: nextMedia.type, 
        url: nextMedia.url, 
        index: selectedMedia.index + 1 
      });
    }
  };

  const handlePrevious = () => {
    if (selectedMedia && selectedMedia.index > 0) {
      const previousMedia = allMedia[selectedMedia.index - 1];
      setSelectedMedia({ 
        type: previousMedia.type, 
        url: previousMedia.url, 
        index: selectedMedia.index - 1 
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Foto Principal */}
      <div 
        className="aspect-[3/4] relative rounded-lg overflow-hidden bg-muted cursor-pointer"
        onClick={() => profilePhotoUrl && handleMediaClick(
          "image",
          `https://keqcfrpqctyfxpfoxrkp.supabase.co/storage/v1/object/public/profile_photos/${profilePhotoUrl}`
        )}
      >
        {profilePhotoUrl ? (
          <img
            src={`https://keqcfrpqctyfxpfoxrkp.supabase.co/storage/v1/object/public/profile_photos/${profilePhotoUrl}`}
            alt={name}
            className="object-cover w-full h-full hover:opacity-90 transition-opacity"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted-foreground">Sem foto</span>
          </div>
        )}
      </div>

      {/* Galeria de Fotos */}
      {photos && photos.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Galeria de Fotos</h3>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo) => (
              <div 
                key={photo.id} 
                className="aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer"
                onClick={() => handleMediaClick(
                  "image",
                  `https://keqcfrpqctyfxpfoxrkp.supabase.co/storage/v1/object/public/ad_photos/${photo.photo_url}`
                )}
              >
                <img
                  src={`https://keqcfrpqctyfxpfoxrkp.supabase.co/storage/v1/object/public/ad_photos/${photo.photo_url}`}
                  alt="Foto do anúncio"
                  className="object-cover w-full h-full hover:opacity-90 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vídeos */}
      <div>
        <h3 className="font-semibold mb-2">Vídeos</h3>
        {videos && videos.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {videos.map((video) => (
              <div 
                key={video.id} 
                className="aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer"
                onClick={() => handleMediaClick(
                  "video",
                  `https://keqcfrpqctyfxpfoxrkp.supabase.co/storage/v1/object/public/ad_videos/${video.video_url}`
                )}
              >
                <video
                  src={`https://keqcfrpqctyfxpfoxrkp.supabase.co/storage/v1/object/public/ad_videos/${video.video_url}`}
                  className="w-full h-full hover:opacity-90 transition-opacity"
                />
              </div>
            ))}
          </div>
        ) : (
          <Alert variant="default" className="bg-muted/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Este anúncio não possui vídeos.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {selectedMedia && (
        <MediaViewer
          type={selectedMedia.type}
          url={selectedMedia.url}
          isOpen={!!selectedMedia}
          onClose={() => setSelectedMedia(null)}
          onNext={handleNext}
          onPrevious={handlePrevious}
          hasNext={selectedMedia.index < allMedia.length - 1}
          hasPrevious={selectedMedia.index > 0}
        />
      )}
    </div>
  );
};