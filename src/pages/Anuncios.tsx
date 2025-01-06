import { useState, useEffect } from "react";
import { AdvancedFilter } from "@/components/advertisement/AdvancedFilter";
import { AdvertisementList } from "@/components/advertisement/AdvertisementList";
import { AdvertisementDialog } from "@/components/advertisement/AdvertisementDialog";
import { Button } from "@/components/ui/button";
import { useAdvertisementList } from "@/hooks/useAdvertisementList";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Advertisement } from "@/types/advertisement";

type Filters = {
  category?: "mulher" | "trans" | "homem";
  state?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minAge?: number;
  maxAge?: number;
  minHeight?: number;
  maxHeight?: number;
  minWeight?: number;
  maxWeight?: number;
  ethnicity?: string;
  hairColor?: string;
  bodyType?: string;
  services?: string[];
  serviceLocations?: string[];
  style?: string;
};

const Anuncios = () => {
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
  const [filters, setFilters] = useState<Filters>({});
  const { session } = useAuth();

  // Get user role for debugging
  const getUserRole = async () => {
    if (!session?.user?.id) return null;
    
    const { data: userData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    console.log("User role data:", userData);
    console.log("User Role:", userData?.role);
    console.log("Is admin:", userData?.role === 'admin');
    return userData?.role;
  };

  // Call getUserRole when component mounts
  useEffect(() => {
    if (session?.user?.id) {
      console.log("User ID:", session.user.id);
      getUserRole();
    }
  }, [session?.user?.id]);

  const { 
    data, 
    isLoading, 
    isFetchingNextPage, 
    hasNextPage, 
    fetchNextPage 
  } = useAdvertisementList({ filters });

  const handleFilterChange = (newFilters: Filters) => {
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