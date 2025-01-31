import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Advertisement } from "@/types/advertisement";
import { AdvertisementList } from "@/components/advertisement/AdvertisementList";
import { toast } from "sonner";

const Favoritos = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data: favorites, error: favoritesError } = await supabase
          .from("favorites")
          .select(`
            advertisement_id,
            advertisements (
              *,
              advertisement_services (
                service
              ),
              advertisement_service_locations (
                location
              ),
              advertisement_photos (
                id,
                advertisement_id,
                photo_url,
                created_at
              ),
              advertisement_videos (
                id,
                advertisement_id,
                video_url,
                created_at
              ),
              advertisement_reviews (
                id,
                status,
                review_notes,
                updated_at
              )
            )
          `);

        if (favoritesError) {
          console.error("Error fetching favorites:", favoritesError);
          toast.error("Erro ao carregar favoritos");
          return;
        }

        const ads = favorites
          .map(f => f.advertisements)
          .filter(Boolean) as Advertisement[];

        setAdvertisements(ads);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Erro ao carregar favoritos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Meus Favoritos</h1>
      <AdvertisementList
        advertisements={advertisements}
        isLoading={isLoading}
        isFavoritesPage
      />
    </div>
  );
};

export default Favoritos;