import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Advertisement } from "@/types/advertisement";
import { AdvertisementCard } from "@/components/advertisement/AdvertisementCard";

export const Favoritos = () => {
  const { session } = useAuth();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const { data: favoritesData, error } = await supabase
        .from("favorites")
        .select(`
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
          )
        `)
        .eq("user_id", session.user.id);

      if (error) {
        console.error("Error fetching favorites:", error);
        throw error;
      }

      return favoritesData.map(favorite => favorite.advertisements as Advertisement);
    },
    enabled: !!session?.user?.id
  });

  if (!session) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Faça login para ver seus favoritos</h2>
          <p className="text-muted-foreground">Você precisa estar logado para acessar seus favoritos</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-96 bg-black/20 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((advertisement) => (
          <AdvertisementCard key={advertisement.id} advertisement={advertisement} />
        ))}
      </div>
    </div>
  );
};