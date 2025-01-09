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
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching favorites for user:", session.user.id);
        
        const { data: favoritesData, error: favoritesError } = await supabase
          .from("favorites")
          .select("advertisement_id")
          .eq("user_id", session.user.id);

        if (favoritesError) {
          console.error("Error fetching favorites:", favoritesError);
          toast.error("Erro ao carregar favoritos");
          return;
        }

        if (!favoritesData?.length) {
          setFavorites([]);
          setLoading(false);
          return;
        }

        const advertisementIds = favoritesData.map((f) => f.advertisement_id);
        console.log("Found advertisement IDs:", advertisementIds);

        const { data: advertisementsData, error: advertisementsError } = await supabase
          .from("advertisements")
          .select(`
            *,
            advertisement_services!inner (*),
            advertisement_service_locations!inner (*),
            advertisement_photos!inner (*),
            advertisement_videos!inner (*),
            advertisement_comments!inner (*),
            advertisement_reviews!inner (*)
          `)
          .in("id", advertisementIds)
          .eq("status", "approved");

        if (advertisementsError) {
          console.error("Error fetching advertisements:", advertisementsError);
          toast.error("Erro ao carregar anúncios");
          return;
        }

        console.log("Fetched advertisements:", advertisementsData);
        setFavorites(advertisementsData as Advertisement[]);
      } catch (error) {
        console.error("Error in fetchFavorites:", error);
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
        isFavoritesPage={true}
      />
    </div>
  );
};

export default Favoritos;