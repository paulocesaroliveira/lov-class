import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type ServiceType = Database["public"]["Enums"]["service_type"];
type ServiceLocationType = Database["public"]["Enums"]["service_location_type"];

export const useAdvertisementOperations = () => {
  const saveAdvertisement = async (
    values: any,
    userId: string,
    profilePhotoUrl: string | null,
    isEditing: boolean,
    advertisementId?: string
  ) => {
    console.log("Salvando dados do anúncio:", values);

    const adData = {
      profile_id: userId,
      name: values.name,
      birth_date: values.birthDate,
      height: values.height,
      weight: values.weight,
      category: values.category,
      whatsapp: values.whatsapp,
      state: values.state,
      city: values.city,
      neighborhood: values.neighborhood,
      hourly_rate: values.hourlyRate,
      custom_rate_description: values.customRates.length > 0
        ? JSON.stringify(values.customRates)
        : null,
      style: values.style,
      description: values.description,
      ...(profilePhotoUrl && { profile_photo_url: profilePhotoUrl }),
    };

    const { data: ad, error: adError } = isEditing && advertisementId
      ? await supabase
          .from("advertisements")
          .update(adData)
          .eq("id", advertisementId)
          .select()
          .single()
      : await supabase
          .from("advertisements")
          .insert(adData)
          .select()
          .single();

    if (adError) {
      console.error("Erro ao salvar anúncio:", adError);
      throw adError;
    }

    return ad;
  };

  const saveServices = async (advertisementId: string, services: string[]) => {
    const servicesData = services.map(service => ({
      advertisement_id: advertisementId,
      service: service as ServiceType
    }));

    const { error: servicesError } = await supabase
      .from("advertisement_services")
      .insert(servicesData);

    if (servicesError) {
      console.error("Erro ao salvar serviços:", servicesError);
      throw servicesError;
    }
  };

  const saveServiceLocations = async (advertisementId: string, locations: string[]) => {
    const locationsData = locations.map(location => ({
      advertisement_id: advertisementId,
      location: location as ServiceLocationType
    }));

    const { error: locationsError } = await supabase
      .from("advertisement_service_locations")
      .insert(locationsData);

    if (locationsError) {
      console.error("Erro ao salvar locais de atendimento:", locationsError);
      throw locationsError;
    }
  };

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

    await supabase
      .from("advertisement_services")
      .delete()
      .eq("advertisement_id", advertisementId);

    await supabase
      .from("advertisement_service_locations")
      .delete()
      .eq("advertisement_id", advertisementId);
  };

  return {
    saveAdvertisement,
    saveServices,
    saveServiceLocations,
    savePhotos,
    saveVideos,
    deleteExistingMedia,
  };
};