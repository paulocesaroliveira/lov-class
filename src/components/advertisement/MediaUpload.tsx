import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useImageCompression } from "./hooks/useImageCompression";
import { UploadProgress } from "./components/UploadProgress";
import { useUploadProgress } from "./hooks/useUploadProgress";

type MediaUploadProps = {
  setProfilePhoto: (file: File) => void;
  setPhotos: (files: File[]) => void;
  setVideos: (files: File[]) => void;
};

export const MediaUpload = ({
  setProfilePhoto,
  setPhotos,
  setVideos,
}: MediaUploadProps) => {
  const { compressImage, compressImages } = useImageCompression();
  const { uploadProgress } = useUploadProgress();

  const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressedFile = await compressImage(file);
      setProfilePhoto(compressedFile);
    }
  };

  const handlePhotosChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 15) {
      toast.error("Máximo de 15 fotos permitido");
      return;
    }
    const compressedFiles = await compressImages(files);
    setPhotos(compressedFiles);
  };

  const handleVideosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 8) {
      toast.error("Máximo de 8 vídeos permitido");
      return;
    }
    setVideos(files);
  };

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
              onChange={handleProfilePhotoChange}
            />
            {uploadProgress['profile'] && (
              <UploadProgress
                progress={uploadProgress['profile']}
                fileName="Foto de perfil"
              />
            )}
          </div>
        </div>

        <div>
          <FormLabel>Álbum de Fotos (máximo 15)</FormLabel>
          <div className="mt-2">
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotosChange}
            />
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              fileName !== 'profile' && (
                <UploadProgress
                  key={fileName}
                  progress={progress}
                  fileName={fileName}
                />
              )
            ))}
          </div>
        </div>

        <div>
          <FormLabel>Álbum de Vídeos (máximo 8)</FormLabel>
          <div className="mt-2">
            <Input
              type="file"
              accept="video/*"
              multiple
              onChange={handleVideosChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};