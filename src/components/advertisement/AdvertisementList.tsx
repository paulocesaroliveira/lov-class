import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdvertisementCard } from "./AdvertisementCard";
import { Advertisement } from "@/types/advertisement";
import { Skeleton } from "@/components/ui/skeleton";

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
          `);

        // Only filter out blocked ads on the Anuncios page
        if (location.pathname === "/anuncios") {
          query = query.eq("blocked", false);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching advertisements:", error);
          return;
        }

        setLocalAdvertisements(data || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisements();
  }, [location.pathname, propAdvertisements]);

  if (loading || propIsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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