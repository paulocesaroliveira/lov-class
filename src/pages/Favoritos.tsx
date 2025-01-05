import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Advertisement } from "@/types/advertisement";
import { AdvertisementList } from "@/components/advertisement/AdvertisementList";
import { toast } from "sonner";

const Favoritos = () => {
  const { session } = useAuth();
  const [favorites, setFavorites] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session?.user?.id) return;

      try {
        const { data: favoritesData, error: favoritesError } = await supabase
          .from("favorites")
          .select("advertisement_id")
          .eq("user_id", session.user.id);

        if (favoritesError) {
          console.error("Error fetching favorites:", favoritesError);
          toast.error("Erro ao carregar favoritos");
          return;
        }

        if (favoritesData.length === 0) {
          setFavorites([]);
          setLoading(false);
          return;
        }

        const advertisementIds = favoritesData.map((f) => f.advertisement_id);

        const { data: advertisementsData, error: advertisementsError } = await supabase
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
            ),
            advertisement_comments (
              id
            )
          `
          )
          .in("id", advertisementIds)
          .eq("status", "approved");

        if (advertisementsError) {
          console.error("Error fetching advertisements:", advertisementsError);
          toast.error("Erro ao carregar anúncios");
          return;
        }

        setFavorites(advertisementsData as Advertisement[]);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Erro ao carregar favoritos");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [session?.user?.id]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Meus Favoritos</h1>
      <AdvertisementList
        advertisements={favorites}
        isLoading={loading}
      />
    </div>
  );
};

export default Favoritos;