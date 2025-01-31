import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Advertisement } from "@/types/advertisement";
import { AdvertisementForm } from "@/components/advertisement/AdvertisementForm";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const EditarAnuncio = () => {
  const { id } = useParams<{ id: string }>();
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvertisement = async () => {
      if (!id) return;

      try {
        const { data: advertisementData, error: adError } = await supabase
          .from("advertisements")
          .select(`
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
          `)
          .eq("id", id)
          .single();

        if (adError) {
          console.error("Error fetching advertisement:", adError);
          toast.error("Erro ao carregar anúncio");
          return;
        }

        if (!advertisementData) {
          toast.error("Anúncio não encontrado");
          return;
        }

        setAdvertisement(advertisementData as Advertisement);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Erro ao carregar anúncio");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisement();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="space-y-6">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (!advertisement) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Anúncio não encontrado</h2>
          <p className="text-muted-foreground mt-2">
            O anúncio que você está procurando não existe ou foi removido.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Editar Anúncio</h1>
      <AdvertisementForm advertisement={advertisement} />
    </div>
  );
};

export default EditarAnuncio;