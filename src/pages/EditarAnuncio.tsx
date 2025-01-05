import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdvertisementForm } from "@/components/advertisement/AdvertisementForm";
import { Advertisement } from "@/types/advertisement";
import { toast } from "sonner";
import { z } from "zod";
import { formSchema } from "@/components/advertisement/advertisementSchema";

type EthnicityType = z.infer<typeof formSchema>["ethnicity"];
type HairColorType = z.infer<typeof formSchema>["hairColor"];
type BodyTypeType = z.infer<typeof formSchema>["bodyType"];
type SiliconeType = z.infer<typeof formSchema>["silicone"];
type StyleType = z.infer<typeof formSchema>["style"];

const EditarAnuncio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [advertisementData, setAdvertisementData] = useState<Advertisement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdvertisement = async () => {
      if (!id) {
        toast.error("ID do anúncio não encontrado");
        navigate("/anuncios");
        return;
      }

      console.log("Buscando anúncio com ID:", id);
      
      try {
        const { data: advertisement, error } = await supabase
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
          .maybeSingle();

        if (error) {
          console.error("Erro ao buscar anúncio:", error);
          toast.error("Erro ao carregar anúncio");
          navigate("/anuncios");
          return;
        }

        if (!advertisement) {
          toast.error("Anúncio não encontrado");
          navigate("/anuncios");
          return;
        }

        console.log("Dados do anúncio recebidos:", advertisement);

        const formattedData: Advertisement = {
          id: advertisement.id,
          profile_id: advertisement.profile_id,
          name: advertisement.name,
          birth_date: advertisement.birth_date,
          height: advertisement.height,
          weight: advertisement.weight,
          category: advertisement.category,
          ethnicity: advertisement.ethnicity as EthnicityType,
          hairColor: advertisement.hair_color as HairColorType,
          bodyType: advertisement.body_type as BodyTypeType,
          silicone: advertisement.silicone as SiliconeType,
          contact_phone: advertisement.contact_phone,
          contact_whatsapp: advertisement.contact_whatsapp,
          contact_telegram: advertisement.contact_telegram,
          state: advertisement.state,
          city: advertisement.city,
          neighborhood: advertisement.neighborhood,
          hourly_rate: advertisement.hourly_rate,
          custom_rate_description: advertisement.custom_rate_description,
          custom_rate_value: advertisement.custom_rate_value,
          style: advertisement.style as StyleType,
          description: advertisement.description,
          profile_photo_url: advertisement.profile_photo_url,
          created_at: advertisement.created_at,
          updated_at: advertisement.updated_at,
          blocked: advertisement.blocked,
          block_reason: advertisement.block_reason,
          advertisement_services: advertisement.advertisement_services?.map((s: any) => ({ service: s.service })) || [],
          advertisement_service_locations: advertisement.advertisement_service_locations?.map((l: any) => ({ location: l.location })) || [],
          advertisement_photos: advertisement.advertisement_photos?.map((p: any) => ({ id: p.id, photo_url: p.photo_url })) || [],
          advertisement_videos: advertisement.advertisement_videos?.map((v: any) => ({ id: v.id, video_url: v.video_url })) || [],
          advertisement_comments: []
        };

        console.log("Dados formatados para o formulário:", formattedData);
        setAdvertisementData(formattedData);
      } catch (error) {
        console.error("Erro ao processar dados do anúncio:", error);
        toast.error("Erro ao processar dados do anúncio");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvertisement();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Carregando anúncio...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!advertisementData) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Anúncio</h1>
        <p className="text-muted-foreground">
          Atualize as informações do seu anúncio
        </p>
      </div>

      <AdvertisementForm advertisement={advertisementData} />
    </div>
  );
};

export default EditarAnuncio;