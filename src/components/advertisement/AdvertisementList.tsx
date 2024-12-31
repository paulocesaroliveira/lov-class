import { AdvertisementCard } from "./AdvertisementCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AdvertisementListProps {
  advertisements: any[] | null;
  isLoading: boolean;
  onSelectAd: (ad: any) => void;
  isFavoritesPage?: boolean;
}

export const AdvertisementList = ({ 
  advertisements, 
  isLoading, 
  onSelectAd,
  isFavoritesPage = false 
}: AdvertisementListProps) => {
  const { session } = useAuth();

  // Fetch user's favorites if logged in and not on favorites page
  const { data: favorites } = useQuery({
    queryKey: ["favorites", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("favorites")
        .select("advertisement_id")
        .eq("user_id", session.user.id);

      if (error) throw error;
      return data.map(fav => fav.advertisement_id);
    },
    enabled: !!session?.user?.id && !isFavoritesPage,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} className="h-[400px] rounded-lg" />
        ))}
      </div>
    );
  }

  if (!advertisements || advertisements.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum anúncio encontrado</p>
      </div>
    );
  }

  // Embaralha o array de anúncios usando o algoritmo Fisher-Yates
  const shuffledAds = [...advertisements].sort(() => Math.random() - 0.5);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {shuffledAds.map((ad) => (
        <AdvertisementCard 
          key={ad.id}
          advertisement={ad}
          onClick={() => onSelectAd(ad)}
          isFavorite={isFavoritesPage || favorites?.includes(ad.id)}
        />
      ))}
    </div>
  );
};