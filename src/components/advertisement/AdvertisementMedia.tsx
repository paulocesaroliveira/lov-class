import { MediaViewer } from "./MediaViewer";
import { useState } from "react";

type AdvertisementMediaProps = {
  profilePhotoUrl?: string;
  photos?: { id: string; photo_url: string }[];
  videos?: { id: string; video_url: string }[];
  name: string;
};

export const AdvertisementMedia = ({ profilePhotoUrl, photos, videos, name }: AdvertisementMediaProps) => {
  const [selectedMedia, setSelectedMedia] = useState<{ type: "image" | "video"; url: string } | null>(null);

  const handleMediaClick = (type: "image" | "video", url: string) => {
    setSelectedMedia({ type, url });
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
      {videos && videos.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Vídeos</h3>
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
        </div>
      )}

      {selectedMedia && (
        <MediaViewer
          type={selectedMedia.type}
          url={selectedMedia.url}
          isOpen={!!selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </div>
  );
};