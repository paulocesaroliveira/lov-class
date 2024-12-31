import { supabase } from "@/integrations/supabase/client";

export const useAdvertisementMedia = () => {
  const savePhotos = async (advertisementId: string, photoUrls: string[]) => {
    if (photoUrls.length === 0) return;

    const { error: photosError } = await supabase
      .from("advertisement_photos")
      .insert(
        photoUrls.map((url) => ({
          advertisement_id: advertisementId,
          photo_url: url,
        }))
      );

    if (photosError) {
      console.error("Erro ao salvar fotos:", photosError);
      throw photosError;
    }
  };

  const saveVideos = async (advertisementId: string, videoUrls: string[]) => {
    if (videoUrls.length === 0) return;

    const { error: videosError } = await supabase
      .from("advertisement_videos")
      .insert(
        videoUrls.map((url) => ({
          advertisement_id: advertisementId,
          video_url: url,
        }))
      );

    if (videosError) {
      console.error("Erro ao salvar vídeos:", videosError);
      throw videosError;
    }
  };

  const deleteExistingMedia = async (advertisementId: string) => {
    await supabase
      .from("advertisement_photos")
      .delete()
      .eq("advertisement_id", advertisementId);

    await supabase
      .from("advertisement_videos")
      .delete()
      .eq("advertisement_id", advertisementId);
  };

  return {
    savePhotos,
    saveVideos,
    deleteExistingMedia,
  };
};