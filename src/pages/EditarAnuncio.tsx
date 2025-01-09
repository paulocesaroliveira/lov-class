import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Advertisement } from "@/types/advertisement";
import { AdvertisementForm } from "@/components/advertisement/AdvertisementForm";
import { toast } from "sonner";

const EditarAnuncio = () => {
  const { id } = useParams<{ id: string }>();
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvertisement = async () => {
      if (!id) return;

      try {
        const { data: advertisementData, error } = await supabase
          .from("advertisements")
          .select(`
            *,
            advertisement_services (
              *
            ),
            advertisement_service_locations (
              *
            ),
            advertisement_photos (
              *
            ),
            advertisement_videos (
              *
            ),
            advertisement_comments (
              *
            ),
            advertisement_reviews (
              *
            )
          `)
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching advertisement:", error);
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
    return <div>Carregando...</div>;
  }

  if (!advertisement) {
    return <div>Anúncio não encontrado</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Editar Anúncio</h1>
      <AdvertisementForm advertisement={advertisement} />
    </div>
  );
};

export default EditarAnuncio;