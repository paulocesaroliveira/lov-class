import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Advertisement } from "@/types/advertisement";
import { AdvertisementForm } from "@/components/advertisement/AdvertisementForm";
import { toast } from "sonner";

const EditarAnuncio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvertisement = async () => {
      try {
        const { data, error } = await supabase
          .from("advertisements")
          .select(
            `
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
            ),
            advertisement_comments (
              id
            ),
            advertisement_reviews (
              status,
              review_notes,
              block_reason,
              updated_at
            )
          `
          )
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching advertisement:", error);
          toast.error("Erro ao carregar anúncio");
          return;
        }

        if (!data) {
          toast.error("Anúncio não encontrado");
          navigate("/anuncios");
          return;
        }

        // Transform the data to match the Advertisement type
        const transformedData: Advertisement = {
          ...data,
          advertisement_reviews: data.advertisement_reviews || []
        };

        setAdvertisement(transformedData);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Erro ao carregar anúncio");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAdvertisement();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!advertisement) {
    return null;
  }

  return <AdvertisementForm advertisement={advertisement} />;
};

export default EditarAnuncio;