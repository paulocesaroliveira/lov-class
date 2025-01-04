import { useQuery } from "@tanstack/react-query";
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
  const [page, setPage] = useState(1);

  const { data: advertisements, isLoading, isFetching, hasNextPage, fetchNextPage } = useQuery({
    queryKey: ["advertisements", filters, page],
    queryFn: async ({ pageParam = 1 }) => {
      const from = (pageParam - 1) * ITEMS_PER_PAGE;
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
        `)
        .eq('blocked', false)
        .order("created_at", { ascending: false })
        .range(from, to);

      // Apply filters
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

      const { data, error, count } = await query.select('*', { count: 'exact' });

      if (error) {
        console.error("Error fetching advertisements:", error);
        toast.error("Erro ao carregar anúncios");
        throw error;
      }

      return {
        data,
        nextPage: data.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined,
        totalCount: count
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    keepPreviousData: true
  });

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const allAds = advertisements?.pages?.flatMap(page => page.data) || [];
  const totalCount = advertisements?.pages?.[0]?.totalCount || 0;
  const canLoadMore = allAds.length < totalCount;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Anúncios</h1>
        <AdvancedFilter onFilterChange={setFilters} />
      </div>
      
      <AdvertisementList 
        advertisements={allAds}
        isLoading={isLoading}
        onSelectAd={setSelectedAd}
      />

      {canLoadMore && (
        <div className="flex justify-center">
          <Button
            onClick={loadMore}
            disabled={isFetching}
            variant="secondary"
            size="lg"
            className="w-full max-w-xs"
          >
            {isFetching ? "Carregando..." : "Carregar mais anúncios"}
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