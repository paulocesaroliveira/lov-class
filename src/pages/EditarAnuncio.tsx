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
          id: data.id,
          profile_id: data.profile_id,
          name: data.name,
          birth_date: data.birth_date,
          height: data.height,
          weight: data.weight,
          category: data.category,
          contact_phone: data.contact_phone,
          contact_whatsapp: data.contact_whatsapp,
          contact_telegram: data.contact_telegram,
          state: data.state,
          city: data.city,
          neighborhood: data.neighborhood,
          hourly_rate: data.hourly_rate,
          custom_rate_description: data.custom_rate_description,
          custom_rate_value: data.custom_rate_value,
          description: data.description,
          profile_photo_url: data.profile_photo_url,
          created_at: data.created_at,
          updated_at: data.updated_at,
          style: data.style,
          ethnicity: data.ethnicity,
          hair_color: data.hair_color,
          body_type: data.body_type,
          silicone: data.silicone,
          block_reason: data.block_reason,
          status: data.status,
          advertisement_services: data.advertisement_services,
          advertisement_service_locations: data.advertisement_service_locations,
          advertisement_photos: data.advertisement_photos,
          advertisement_videos: data.advertisement_videos,
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

  return <AdvertisementForm initialData={advertisement} />;
};

export default EditarAnuncio;