import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdvertisementForm } from "@/components/advertisement/AdvertisementForm";
import { FormValues } from "@/types/advertisement";

const EditarAnuncio = () => {
  const { id } = useParams();
  const [advertisementData, setAdvertisementData] = useState<any>(null);

  useEffect(() => {
    const fetchAdvertisement = async () => {
      const { data: advertisement, error } = await supabase
        .from("advertisements")
        .select(`
          *,
          advertisement_services (
            service
          ),
          advertisement_service_locations (
            location
          ),
          advertisement_photos (
            photo_url
          ),
          advertisement_videos (
            video_url
          )
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching advertisement:", error);
        return;
      }

      console.log("Fetched advertisement data:", advertisement); // Debug log
      setAdvertisementData(advertisement);
    };

    if (id) {
      fetchAdvertisement();
    }
  }, [id]);

  if (!advertisementData) {
    return <div>Loading...</div>;
  }

  const formattedData = {
    name: advertisementData.name,
    birthDate: advertisementData.birth_date,
    height: advertisementData.height,
    weight: advertisementData.weight,
    category: advertisementData.category,
    ethnicity: advertisementData.ethnicity,
    hairColor: advertisementData.hair_color,
    bodyType: advertisementData.body_type,
    silicone: advertisementData.silicone,
    whatsapp: advertisementData.whatsapp,
    state: advertisementData.state,
    city: advertisementData.city,
    neighborhood: advertisementData.neighborhood,
    hourlyRate: advertisementData.hourly_rate,
    customRates: advertisementData.custom_rate_description
      ? JSON.parse(advertisementData.custom_rate_description)
      : [],
    style: advertisementData.style,
    description: advertisementData.description,
    services: advertisementData.advertisement_services?.map((s: any) => s.service) || [],
    serviceLocations: advertisementData.advertisement_service_locations?.map((l: any) => l.location) || [],
    advertisement_services: advertisementData.advertisement_services || [],
    advertisement_service_locations: advertisementData.advertisement_service_locations || [],
    advertisement_photos: advertisementData.advertisement_photos || [],
    advertisement_videos: advertisementData.advertisement_videos || [],
  } as FormValues & {
    advertisement_services: { service: string }[];
    advertisement_service_locations: { location: string }[];
    advertisement_photos: { photo_url: string }[];
    advertisement_videos: { video_url: string }[];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Anúncio</h1>
        <p className="text-muted-foreground">
          Atualize as informações do seu anúncio
        </p>
      </div>

      <AdvertisementForm advertisement={formattedData} />
    </div>
  );
};

export default EditarAnuncio;