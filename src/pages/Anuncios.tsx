import { useState } from "react";
import { AdvancedFilter } from "@/components/advertisement/AdvancedFilter";
import { AdvertisementList } from "@/components/advertisement/AdvertisementList";
import { AdvertisementDialog } from "@/components/advertisement/AdvertisementDialog";
import { Button } from "@/components/ui/button";
import { useAdvertisementList } from "@/hooks/useAdvertisementList";

const Anuncios = () => {
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [filters, setFilters] = useState<any>({});

  const { 
    data, 
    isLoading, 
    isFetchingNextPage, 
    hasNextPage, 
    fetchNextPage 
  } = useAdvertisementList({ filters });

  const handleFilterChange = (newFilters: any) => {
    console.log("Applying new filters:", newFilters);
    setFilters(newFilters);
  };

  const allAds = data?.pages?.flatMap(page => page.data) || [];
  const totalCount = data?.pages?.[0]?.count || 0;
  const canLoadMore = allAds.length < totalCount;

  console.log("Rendered ads:", allAds.length);
  console.log("Total count:", totalCount);

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