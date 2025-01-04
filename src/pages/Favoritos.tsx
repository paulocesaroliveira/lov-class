import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AdvertisementList } from "@/components/advertisement/AdvertisementList";
import { AdvertisementDialog } from "@/components/advertisement/AdvertisementDialog";
import { Advertisement } from "@/types/advertisement";
import { toast } from "sonner";

const Favoritos = () => {
  const { session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);

  useEffect(() => {
    if (!authLoading && !session) {
      toast.error("Faça login para acessar seus favoritos");
      navigate("/login", { 
        state: { 
          returnTo: "/favoritos",
          message: "Faça login para acessar seus favoritos" 
        }
      });
    }
  }, [session, navigate, authLoading]);

  const { data: favorites, isLoading } = useQuery({
    queryKey: ["favorites", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        return [];
      }

      const { data: favorites, error } = await supabase
        .from("favorites")
        .select(`
          id,
          advertisement_id,
          advertisements (
            id,
            profile_id,
            name,
            birth_date,
            height,
            weight,
            category,
            whatsapp,
            state,
            city,
            neighborhood,
            hourly_rate,
            custom_rate_description,
            custom_rate_value,
            description,
            profile_photo_url,
            created_at,
            updated_at,
            style,
            ethnicity,
            hair_color,
            body_type,
            silicone,
            blocked,
            block_reason,
            advertisement_photos (
              id,
              photo_url
            ),
            advertisement_videos (
              id,
              video_url
            ),
            advertisement_services (
              service
            ),
            advertisement_service_locations (
              location
            ),
            advertisement_comments (
              id
            )
          )
        `)
        .eq("user_id", session.user.id);

      if (error) {
        toast.error("Erro ao carregar favoritos");
        throw error;
      }

      const transformedFavorites = favorites
        .map(favorite => favorite.advertisements)
        .filter((ad): ad is Advertisement => ad !== null);

      return transformedFavorites;
    },
    enabled: !!session?.user?.id,
  });

  if (authLoading) {
    return null;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Meus Favoritos</h1>
      <AdvertisementList
        advertisements={favorites || []}
        isLoading={isLoading}
        onSelectAd={setSelectedAd}
        isFavoritesPage={true}
      />
      {selectedAd && (
        <AdvertisementDialog
          advertisement={selectedAd}
          onOpenChange={(open) => !open && setSelectedAd(null)}
        />
      )}
    </div>
  );
};

export default Favoritos;