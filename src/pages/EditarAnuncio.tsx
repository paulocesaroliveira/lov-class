import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Advertisement } from "@/types/advertisement";
import { AdvertisementForm } from "@/components/advertisement/AdvertisementForm";
import { toast } from "sonner";

const transformDatabaseToFormData = (data: any): Advertisement => {
  return {
    ...data,
    birthDate: data.birth_date,
    hairColor: data.hair_color,
    bodyType: data.body_type,
    hourlyRate: data.hourly_rate,
    customRates: data.custom_rate_description ? [{
      description: data.custom_rate_description,
      value: data.custom_rate_value
    }] : [],
  };
};

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
              photo_url
            ),
            advertisement_videos (
              video_url
            ),
            advertisement_reviews (
              id,
              status,
              review_notes,
              updated_at
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

        const { data: commentsData, error: commentsError } = await supabase
          .from("advertisement_comments")
          .select("*")
          .eq("advertisement_id", id);

        if (commentsError) {
          console.error("Error fetching comments:", commentsError);
        }

        const fullAdvertisement = {
          ...advertisementData,
          advertisement_comments: commentsData || []
        };

        setAdvertisement(transformDatabaseToFormData(fullAdvertisement) as Advertisement);
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
