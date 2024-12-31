import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { AdvertisementList } from "@/components/advertisement/AdvertisementList";
import { AdvertisementDialog } from "@/components/advertisement/AdvertisementDialog";
import { toast } from "sonner";

const Favoritos = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [selectedAd, setSelectedAd] = useState<any>(null);

  // Redirect to login if not authenticated
  if (!session) {
    navigate("/login");
    return null;
  }

  const { data: favorites, isLoading } = useQuery({
    queryKey: ["favorites", session?.user.id],
    queryFn: async () => {
      const { data: favorites, error } = await supabase
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
              photo_url
            ),
            advertisement_videos (
              id,
              video_url
            )
          )
        `)
        .eq("user_id", session.user.id);

      if (error) {
        toast.error("Erro ao carregar favoritos");
        throw error;
      }

      // Transform the data to match the expected format
      return favorites.map(f => ({
        ...f.advertisements,
        isFavorite: true
      }));
    },
    enabled: !!session,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Meus Favoritos</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie seus anúncios favoritos
        </p>
      </div>

      <AdvertisementList
        advertisements={favorites}
        isLoading={isLoading}
        onSelectAd={setSelectedAd}
      />

      <AdvertisementDialog
        advertisement={selectedAd}
        onOpenChange={() => setSelectedAd(null)}
      />
    </div>
  );
};

export default Favoritos;