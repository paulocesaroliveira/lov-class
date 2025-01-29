import { Advertisement, AdvertisementListProps } from "@/types/advertisement";
import { Card } from "@/components/ui/card";
import { AdvertisementCard } from "./AdvertisementCard";
import { Skeleton } from "@/components/ui/skeleton";

export const AdvertisementList = ({ 
  advertisements, 
  isLoading, 
  isFavoritesPage 
}: AdvertisementListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="p-4">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <div className="space-y-2 mt-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!advertisements.length) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">
          {isFavoritesPage
            ? "Você ainda não adicionou nenhum anúncio aos favoritos"
            : "Nenhum anúncio encontrado"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {advertisements.map((advertisement) => (
        <AdvertisementCard
          key={advertisement.id}
          advertisement={advertisement}
        />
      ))}
    </div>
  );
};