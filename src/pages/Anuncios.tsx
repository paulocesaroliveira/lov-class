import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { services } from "@/components/advertisement/constants";
import { AdvancedFilter } from "@/components/advertisement/AdvancedFilter";
import { toast } from "sonner";
import { AdvertisementList } from "@/components/advertisement/AdvertisementList";

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
            photo_url
          ),
          advertisement_videos (
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

  const getServiceLabel = (serviceId: string) => {
    return services.find((s) => s.id === serviceId)?.label || serviceId;
  };

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

      <Dialog open={!!selectedAd} onOpenChange={() => setSelectedAd(null)}>
        {selectedAd && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedAd.name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Foto Principal */}
              <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                {selectedAd.profile_photo_url ? (
                  <img
                    src={`https://keqcfrpqctyfxpfoxrkp.supabase.co/storage/v1/object/public/profile_photos/${selectedAd.profile_photo_url}`}
                    alt={selectedAd.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground">Sem foto</span>
                  </div>
                )}
              </div>

              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Informações Básicas</h3>
                  <div className="space-y-2 text-sm">
                    <p>Idade: {new Date().getFullYear() - new Date(selectedAd.birth_date).getFullYear()} anos</p>
                    <p>Altura: {selectedAd.height}cm</p>
                    <p>Peso: {selectedAd.weight}kg</p>
                    <p>Categoria: {selectedAd.category}</p>
                    <p>Estilo: {selectedAd.style}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Localização</h3>
                  <div className="space-y-2 text-sm">
                    <p>Estado: {selectedAd.state}</p>
                    <p>Cidade: {selectedAd.city}</p>
                    <p>Bairro: {selectedAd.neighborhood}</p>
                    <p>WhatsApp: {selectedAd.whatsapp}</p>
                  </div>
                </div>
              </div>

              {/* Valores */}
              <div>
                <h3 className="font-semibold mb-2">Valores</h3>
                <div className="space-y-2">
                  <p className="text-lg font-medium">R$ {selectedAd.hourly_rate}/hora</p>
                  {selectedAd.custom_rate_description && (
                    <p>
                      {selectedAd.custom_rate_description}: R$ {selectedAd.custom_rate_value}
                    </p>
                  )}
                </div>
              </div>

              {/* Serviços */}
              <div>
                <h3 className="font-semibold mb-2">Serviços</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedAd.advertisement_services.map((service: any) => (
                    <Badge key={service.service} variant="secondary">
                      {getServiceLabel(service.service)}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Descrição */}
              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-sm whitespace-pre-wrap">{selectedAd.description}</p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Anuncios;
