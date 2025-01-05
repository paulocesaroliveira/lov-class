import { supabase } from "@/integrations/supabase/client";
import { ServiceType, ServiceLocationType } from "@/integrations/supabase/types/enums";

export const useAdvertisementServices = () => {
  const saveServices = async (advertisementId: string, services: ServiceType[]) => {
    await supabase
      .from("advertisement_services")
      .delete()
      .eq("advertisement_id", advertisementId);

    if (services.length === 0) return;

    const { error: servicesError } = await supabase
      .from("advertisement_services")
      .insert(
        services.map(service => ({
          advertisement_id: advertisementId,
          service: service
        }))
      );

    if (servicesError) {
      console.error("Erro ao salvar serviços:", servicesError);
      throw servicesError;
    }
  };

  const saveServiceLocations = async (advertisementId: string, locations: ServiceLocationType[]) => {
    await supabase
      .from("advertisement_service_locations")
      .delete()
      .eq("advertisement_id", advertisementId);

    if (locations.length === 0) return;

    const { error: locationsError } = await supabase
      .from("advertisement_service_locations")
      .insert(
        locations.map(location => ({
          advertisement_id: advertisementId,
          location: location
        }))
      );

    if (locationsError) {
      console.error("Erro ao salvar locais de atendimento:", locationsError);
      throw locationsError;
    }
  };

  return {
    saveServices,
    saveServiceLocations,
  };
};