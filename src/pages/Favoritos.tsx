import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AdvertisementList } from "@/components/advertisement/AdvertisementList";
import { AdvertisementDialog } from "@/components/advertisement/AdvertisementDialog";
import { toast } from "sonner";

const Favoritos = () => {
  const { session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedAd, setSelectedAd] = useState<any>(null);

  // Redirect if not authenticated
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

      // Transform the data to match the expected format
      return favorites.map((favorite) => ({
        ...favorite.advertisements,
        isFavorite: true
      }));
    },
    enabled: !!session?.user?.id,
  });

  // Don't render anything while checking authentication
  if (authLoading) {
    return null;
  }

  // Don't render if not authenticated
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