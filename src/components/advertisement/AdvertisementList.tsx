import { AdvertisementCard } from "./AdvertisementCard";
import { Skeleton } from "@/components/ui/skeleton";

interface AdvertisementListProps {
  advertisements: any[] | null;
  isLoading: boolean;
  onSelectAd: (ad: any) => void;
}

export const AdvertisementList = ({ advertisements, isLoading, onSelectAd }: AdvertisementListProps) => {
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
        />
      ))}
    </div>
  );
};