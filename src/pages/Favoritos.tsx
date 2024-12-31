import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { AdvertisementList } from "@/components/advertisement/AdvertisementList";
import { AdvertisementDialog } from "@/components/advertisement/AdvertisementDialog";

const Favoritos = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedAd, setSelectedAd] = useState<any>(null);

  // Fetch favorites data
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
            )
          )
        `)
        .eq("user_id", session.user.id);

      if (error) {
        toast.error("Erro ao carregar favoritos");
        throw error;
      }

      return favorites.map((favorite) => ({
        ...favorite.advertisements,
        isFavorite: true
      }));
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (!session) {
      navigate("/login", { 
        state: { 
          returnTo: "/favoritos",
          message: "Faça login para acessar seus favoritos" 
        }
      });
    }
  }, [session, navigate]);

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