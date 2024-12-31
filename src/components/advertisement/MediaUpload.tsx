import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type MediaUploadProps = {
  setProfilePhoto: (file: File | null) => void;
  setPhotos: (files: File[]) => void;
  setVideos: (files: File[]) => void;
};

export const MediaUpload = ({
  setProfilePhoto,
  setPhotos,
  setVideos,
}: MediaUploadProps) => {
  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="text-xl font-semibold">Fotos e Vídeos</h2>

      <div className="space-y-4">
        <div>
          <FormLabel>Foto de Perfil</FormLabel>
          <div className="mt-2">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        <div>
          <FormLabel>Álbum de Fotos (máximo 15)</FormLabel>
          <div className="mt-2">
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length > 15) {
                  toast.error("Máximo de 15 fotos permitido");
                  return;
                }
                setPhotos(files);
              }}
            />
          </div>
        </div>

        <div>
          <FormLabel>Álbum de Vídeos (máximo 8)</FormLabel>
          <div className="mt-2">
            <Input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length > 8) {
                  toast.error("Máximo de 8 vídeos permitido");
                  return;
                }
                setVideos(files);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};