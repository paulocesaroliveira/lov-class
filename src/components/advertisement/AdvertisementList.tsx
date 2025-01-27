import { Advertisement } from "@/types/advertisement";
import { AdvertisementCard } from "./AdvertisementCard";

interface AdvertisementListProps {
  advertisements: Advertisement[];
  isLoading: boolean;
  onSelectAd: (ad: Advertisement) => void;
}

export const AdvertisementList = ({
  advertisements,
  isLoading,
  onSelectAd
}: AdvertisementListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-64 bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (!advertisements?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Nenhum anúncio encontrado
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {advertisements.map((ad) => (
        <AdvertisementCard
          key={ad.id}
          advertisement={ad}
          onClick={() => onSelectAd(ad)}
        />
      ))}
    </div>
  );
};