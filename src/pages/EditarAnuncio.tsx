import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAdvertisement } from "@/hooks/useAdvertisement";
import { AdvertisementForm } from "@/components/advertisement/AdvertisementForm";
import { FormValues } from "@/types/advertisement";

const EditarAnuncio = () => {
  const { id } = useParams();
  const { data: advertisementData, isLoading: isLoadingAd } = useAdvertisement(id);

  if (isLoadingAd) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!advertisementData) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Anúncio não encontrado
        </h2>
        <p className="mt-2 text-gray-600">
          O anúncio que você está procurando não existe ou foi removido.
        </p>
      </div>
    );
  }

  const formattedAdvertisement = {
    ...advertisementData,
    birthDate: advertisementData.birth_date,
    hourlyRate: advertisementData.hourly_rate,
    customRates: advertisementData.custom_rate_description && advertisementData.custom_rate_value 
      ? [{ description: advertisementData.custom_rate_description, value: advertisementData.custom_rate_value }]
      : [],
    services: advertisementData.advertisement_services?.map(s => s.service) || [],
    serviceLocations: advertisementData.advertisement_service_locations?.map(l => l.location) || [],
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Editar Anúncio</h1>
        <p className="text-muted-foreground">
          Atualize as informações do seu anúncio abaixo
        </p>
      </div>

      <AdvertisementForm advertisement={formattedAdvertisement} />
    </div>
  );
};

export default EditarAnuncio;