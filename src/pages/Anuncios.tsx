import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { AdvancedFilter } from "@/components/advertisement/AdvancedFilter";
import { toast } from "sonner";
import { AdvertisementList } from "@/components/advertisement/AdvertisementList";
import { AdvertisementDialog } from "@/components/advertisement/AdvertisementDialog";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 30;

const Anuncios = () => {
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [filters, setFilters] = useState<any>({});

  const { 
    data, 
    isLoading, 
    isFetchingNextPage, 
    hasNextPage, 
    fetchNextPage,
    refetch 
  } = useInfiniteQuery({
    queryKey: ["advertisements", filters],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
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
            id,
            photo_url
          ),
          advertisement_videos (
            id,
            video_url
          ),
          advertisement_comments (
            id
          )
        `, { count: 'exact' })
        .eq('status', 'approved')  // Changed from blocked=false to status=approved
        .order("created_at", { ascending: false })
        .range(from, to);

      // Apply filters
      if (filters.category) {
        query = query.eq("category", filters.category);
      }
      if (filters.city) {
        query = query.eq("city", filters.city);
      }
      if (filters.neighborhood) {
        query = query.eq("neighborhood", filters.neighborhood);
      }
      if (filters.minPrice !== undefined) {
        query = query.gte("hourly_rate", filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        query = query.lte("hourly_rate", filters.maxPrice);
      }
      if (filters.ethnicity) {
        query = query.eq("ethnicity", filters.ethnicity);
      }
      if (filters.hairColor) {
        query = query.eq("hair_color", filters.hairColor);
      }
      if (filters.bodyType) {
        query = query.eq("body_type", filters.bodyType);
      }
      if (filters.style) {
        query = query.eq("style", filters.style);
      }
      
      // Age filter
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

      // Service filters
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
          return { data: [], count: 0 };
        }
      }

      // Location filters
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
          return { data: [], count: 0 };
        }
      }

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching advertisements:", error);
        toast.error("Erro ao carregar anúncios");
        throw error;
      }

      return {
        data,
        count,
        nextPage: data?.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    refetch();
  };

  const allAds = data?.pages?.flatMap(page => page.data) || [];
  const totalCount = data?.pages?.[0]?.count || 0;
  const canLoadMore = allAds.length < totalCount;

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <AdvancedFilter onFilterChange={handleFilterChange} />
      </div>
      
      <AdvertisementList 
        advertisements={allAds}
        isLoading={isLoading}
        onSelectAd={setSelectedAd}
      />

      {canLoadMore && (
        <div className="flex justify-center">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="secondary"
            size="lg"
            className="w-full max-w-xs"
          >
            {isFetchingNextPage ? "Carregando..." : "Carregar mais anúncios"}
          </Button>
        </div>
      )}

      <AdvertisementDialog 
        advertisement={selectedAd} 
        onOpenChange={() => setSelectedAd(null)} 
      />
    </div>
  );
};

export default Anuncios;