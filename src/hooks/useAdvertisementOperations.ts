import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type ServiceType = Database["public"]["Enums"]["service_type"];
type ServiceLocationType = Database["public"]["Enums"]["service_location_type"];

export const useAdvertisementOperations = () => {
  const saveAdvertisement = async (
    values: any,
    userId: string,
    profilePhotoUrl: string | null,
    isEditing: boolean
  ) => {
    console.log("Salvando dados do anúncio:", values);
    console.log("isEditing:", isEditing);
    console.log("advertisementId:", values.id);

    const adData = {
      profile_id: userId,
      name: values.name,
      birth_date: values.birthDate,
      height: values.height,
      weight: values.weight,
      category: values.category,
      ethnicity: values.ethnicity,
      hair_color: values.hairColor,
      body_type: values.bodyType,
      silicone: values.silicone,
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

    let result;
    
    if (isEditing && values.id) {
      console.log("Atualizando anúncio existente:", values.id);
      const { data: ad, error: adError } = await supabase
        .from("advertisements")
        .update(adData)
        .eq("id", values.id)
        .select()
        .maybeSingle();

      if (adError) {
        console.error("Erro ao atualizar anúncio:", adError);
        throw adError;
      }

      if (!ad) {
        throw new Error("Anúncio não encontrado");
      }

      result = ad;
    } else {
      try {
        const { data: existingAd, error: existingAdError } = await supabase
          .from("advertisements")
          .select()
          .eq("profile_id", userId)
          .maybeSingle();

        if (existingAdError) {
          console.error("Erro ao verificar anúncio existente:", existingAdError);
          throw existingAdError;
        }

        if (existingAd) {
          throw new Error("Você já possui um anúncio cadastrado");
        }

        const { data: ad, error: adError } = await supabase
          .from("advertisements")
          .insert(adData)
          .select()
          .maybeSingle();

        if (adError) {
          console.error("Erro ao criar anúncio:", adError);
          throw adError;
        }

        if (!ad) {
          throw new Error("Erro ao criar anúncio");
        }

        result = ad;
      } catch (error) {
        console.error("Erro ao processar anúncio:", error);
        throw error;
      }
    }

    return result;
  };

  const saveServices = async (advertisementId: string, services: string[]) => {
    // Primeiro, deletar serviços existentes
    await supabase
      .from("advertisement_services")
      .delete()
      .eq("advertisement_id", advertisementId);

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
    // Primeiro, deletar locais existentes
    await supabase
      .from("advertisement_service_locations")
      .delete()
      .eq("advertisement_id", advertisementId);

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