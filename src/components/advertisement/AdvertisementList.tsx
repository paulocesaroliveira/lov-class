import { Advertisement, AdvertisementListProps } from "@/types/advertisement";
import { AdvertisementCard } from "./AdvertisementCard";
import { AdvertisementDialog } from "./AdvertisementDialog";
import { useState } from "react";

export const AdvertisementList = ({ 
  advertisements, 
  isLoading,
  isFavoritesPage 
}: AdvertisementListProps) => {
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-[400px] rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!advertisements.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {isFavoritesPage 
            ? "Você ainda não tem anúncios favoritos" 
            : "Nenhum anúncio encontrado"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {advertisements.map((advertisement) => (
          <AdvertisementCard
            key={advertisement.id}
            advertisement={advertisement}
            onClick={() => setSelectedAd(advertisement)}
          />
        ))}
      </div>

      <AdvertisementDialog
        advertisement={selectedAd}
        onClose={() => setSelectedAd(null)}
      />
    </>
  );
};