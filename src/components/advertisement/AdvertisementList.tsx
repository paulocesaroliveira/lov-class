import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdvertisementCard } from "./AdvertisementCard";
import { Advertisement } from "@/types/advertisement";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface AdvertisementListProps {
  advertisements?: Advertisement[];
  isLoading?: boolean;
  onSelectAd?: (ad: Advertisement) => void;
  isFavoritesPage?: boolean;
}

export const AdvertisementList = ({ 
  advertisements: propAdvertisements,
  isLoading: propIsLoading,
  onSelectAd,
  isFavoritesPage = false 
}: AdvertisementListProps = {}) => {
  const [localAdvertisements, setLocalAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (propAdvertisements !== undefined) {
      setLocalAdvertisements(propAdvertisements);
      setLoading(false);
      return;
    }

    const fetchAdvertisements = async () => {
      try {
        console.log("Fetching advertisements...");
        let query = supabase
          .from("advertisements")
          .select(`
            *,
            advertisement_services (
              *
            ),
            advertisement_service_locations (
              *
            ),
            advertisement_photos (
              *
            ),
            advertisement_videos (
              *
            ),
            advertisement_comments (
              *
            ),
            advertisement_reviews (
              *
            )
          `)
          .eq('status', 'approved');

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching advertisements:", error);
          toast.error("Erro ao carregar anúncios");
          return;
        }

        console.log("Fetched advertisements:", { dataLength: data?.length });

        // Transform the data to match the Advertisement type
        const transformedData = data?.map(ad => ({
          ...ad,
          advertisement_services: ad.advertisement_services || [],
          advertisement_service_locations: ad.advertisement_service_locations || [],
          advertisement_photos: ad.advertisement_photos || [],
          advertisement_videos: ad.advertisement_videos || [],
          advertisement_comments: ad.advertisement_comments || [],
          advertisement_reviews: ad.advertisement_reviews || []
        })) as Advertisement[];

        setLocalAdvertisements(transformedData || []);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Erro ao carregar anúncios");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisements();
  }, [location.pathname, propAdvertisements]);

  if (loading || propIsLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <Skeleton key={i} className="h-[400px] rounded-lg" />
        ))}
      </div>
    );
  }

  if (!localAdvertisements || localAdvertisements.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum anúncio encontrado</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {localAdvertisements.map((advertisement) => (
        <AdvertisementCard 
          key={advertisement.id} 
          advertisement={advertisement} 
          onClick={() => onSelectAd?.(advertisement)}
        />
      ))}
    </div>
  );
};