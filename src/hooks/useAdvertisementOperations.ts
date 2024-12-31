import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "@/types/advertisement";
import { Database } from "@/integrations/supabase/types";

type ServiceType = Database["public"]["Enums"]["service_type"];
type ServiceLocationType = Database["public"]["Enums"]["service_location_type"];

export const useAdvertisementOperations = () => {
  const saveAdvertisement = async (
    values: FormValues,
    userId: string,
    profilePhotoUrl: string | null,
    isEditing: boolean,
    advertisementId?: string
  ) => {
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

    console.log((isEditing ? "Atualizando" : "Salvando") + " dados do anúncio:", adData);

    if (isEditing && advertisementId) {
      const { data: ad, error: updateError } = await supabase
        .from("advertisements")
        .update(adData)
        .eq("id", advertisementId)
        .select()
        .single();

      if (updateError) throw updateError;
      return ad;
    } else {
      const { data: ad, error: insertError } = await supabase
        .from("advertisements")
        .insert(adData)
        .select()
        .single();

      if (insertError) throw insertError;
      return ad;
    }
  };

  const saveServices = async (advertisementId: string, services: ServiceType[]) => {
    console.log("Salvando serviços:", services);
    const { error: servicesError } = await supabase
      .from("advertisement_services")
      .insert(
        services.map((service) => ({
          advertisement_id: advertisementId,
          service: service as ServiceType,
        }))
      );

    if (servicesError) throw servicesError;
  };

  const saveServiceLocations = async (advertisementId: string, locations: ServiceLocationType[]) => {
    console.log("Salvando locais de atendimento:", locations);
    const { error: locationsError } = await supabase
      .from("advertisement_service_locations")
      .insert(
        locations.map((location) => ({
          advertisement_id: advertisementId,
          location: location as ServiceLocationType,
        }))
      );

    if (locationsError) throw locationsError;
  };

  const savePhotos = async (advertisementId: string, photoUrls: string[]) => {
    if (photoUrls.length === 0) return;

    console.log("Salvando fotos:", photoUrls);
    const { error: photosError } = await supabase
      .from("advertisement_photos")
      .insert(
        photoUrls.map((url) => ({
          advertisement_id: advertisementId,
          photo_url: url,
        }))
      );

    if (photosError) throw photosError;
  };

  const saveVideos = async (advertisementId: string, videoUrls: string[]) => {
    if (videoUrls.length === 0) return;

    console.log("Salvando vídeos:", videoUrls);
    const { error: videosError } = await supabase
      .from("advertisement_videos")
      .insert(
        videoUrls.map((url) => ({
          advertisement_id: advertisementId,
          video_url: url,
        }))
      );

    if (videosError) throw videosError;
  };

  const deleteExistingMedia = async (advertisementId: string) => {
    await supabase
      .from("advertisement_services")
      .delete()
      .eq("advertisement_id", advertisementId);

    await supabase
      .from("advertisement_service_locations")
      .delete()
      .eq("advertisement_id", advertisementId);

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
    saveAdvertisement,
    saveServices,
    saveServiceLocations,
    savePhotos,
    saveVideos,
    deleteExistingMedia,
  };
};