import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useMediaUpload = (userId: string | undefined) => {
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  const uploadProfilePhoto = async () => {
    if (!profilePhoto || !userId) return null;
    
    console.log("Fazendo upload da foto de perfil");
    const { data: profilePhotoData, error: profilePhotoError } = await supabase.storage
      .from("profile_photos")
      .upload(`${userId}/${Date.now()}`, profilePhoto);

    if (profilePhotoError) {
      console.error("Erro no upload da foto de perfil:", profilePhotoError);
      throw profilePhotoError;
    }
    
    console.log("Foto de perfil salva com sucesso:", profilePhotoData.path);
    return profilePhotoData.path;
  };

  const uploadPhotos = async (advertisementId: string) => {
    if (photos.length === 0) return [];

    console.log("Processando fotos:", photos.length);
    const photoUploads = photos.map((photo) =>
      supabase.storage
        .from("ad_photos")
        .upload(`${advertisementId}/${Date.now()}-${photo.name}`, photo)
    );

    const photoResults = await Promise.all(photoUploads);
    return photoResults.map((result) => result.data?.path).filter(Boolean);
  };

  const uploadVideos = async (advertisementId: string) => {
    if (videos.length === 0) return [];

    console.log("Processando vídeos:", videos.length);
    const videoUploads = videos.map((video) =>
      supabase.storage
        .from("ad_videos")
        .upload(`${advertisementId}/${Date.now()}-${video.name}`, video)
    );

    const videoResults = await Promise.all(videoUploads);
    return videoResults.map((result) => result.data?.path).filter(Boolean);
  };

  return {
    profilePhoto,
    setProfilePhoto,
    photos,
    setPhotos,
    videos,
    setVideos,
    uploadProfilePhoto,
    uploadPhotos,
    uploadVideos,
  };
};