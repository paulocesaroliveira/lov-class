import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { AdvancedFilter } from "@/components/advertisement/AdvancedFilter";
import { toast } from "sonner";
import { AdvertisementList } from "@/components/advertisement/AdvertisementList";
import { AdvertisementDialog } from "@/components/advertisement/AdvertisementDialog";

const Anuncios = () => {
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [filters, setFilters] = useState<any>({});

  const { data: advertisements, isLoading } = useQuery({
    queryKey: ["advertisements", filters],
    queryFn: async () => {
      let query = supabase
        .from("advertisements")
        .select(
          `
          *,
          advertisement_services (
            service
          ),
          advertisement_service_locations (
            location
          ),
          advertisement_photos (
            id,
            photo_url
          ),
          advertisement_videos (
            id,
            video_url
          )
        `
        )
        .order("created_at", { ascending: false });

      // Aplicar filtros básicos
      if (filters.category) {
        query = query.eq("category", filters.category);
      }
      if (filters.state) {
        query = query.ilike("state", `%${filters.state}%`);
      }
      if (filters.city) {
        query = query.ilike("city", `%${filters.city}%`);
      }
      if (filters.minPrice !== undefined) {
        query = query.gte("hourly_rate", filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        query = query.lte("hourly_rate", filters.maxPrice);
      }
      
      // Filtro de idade
      if (filters.minAge !== undefined || filters.maxAge !== undefined) {
        const currentYear = new Date().getFullYear();
        
        if (filters.maxAge !== undefined) {
          const minBirthYear = currentYear - filters.maxAge;
          const minDate = `${minBirthYear}-01-01`;
          query = query.gte("birth_date", minDate);
        }
        
        if (filters.minAge !== undefined) {
          const maxBirthYear = currentYear - filters.minAge;
          const maxDate = `${maxBirthYear}-12-31`;
          query = query.lte("birth_date", maxDate);
        }
      }

      // Filtrar por serviços
      if (filters.services && filters.services.length > 0) {
        const { data: serviceIds } = await supabase
          .from("advertisement_services")
          .select("advertisement_id")
          .in("service", filters.services);

        if (serviceIds && serviceIds.length > 0) {
          query = query.in(
            "id",
            serviceIds.map((item) => item.advertisement_id)
          );
        } else {
          return [];
        }
      }

      // Filtrar por locais de atendimento
      if (filters.serviceLocations && filters.serviceLocations.length > 0) {
        const { data: locationIds } = await supabase
          .from("advertisement_service_locations")
          .select("advertisement_id")
          .in("location", filters.serviceLocations);

        if (locationIds && locationIds.length > 0) {
          query = query.in(
            "id",
            locationIds.map((item) => item.advertisement_id)
          );
        } else {
          return [];
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching advertisements:", error);
        toast.error("Erro ao carregar anúncios");
        throw error;
      }

      return data;
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Anúncios</h1>
        <AdvancedFilter onFilterChange={setFilters} />
      </div>
      
      <AdvertisementList 
        advertisements={advertisements}
        isLoading={isLoading}
        onSelectAd={setSelectedAd}
      />

      <AdvertisementDialog 
        advertisement={selectedAd} 
        onOpenChange={() => setSelectedAd(null)} 
      />
    </div>
  );
};

export default Anuncios;