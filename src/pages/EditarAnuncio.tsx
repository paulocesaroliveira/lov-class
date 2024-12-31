import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdvertisementForm } from "@/components/advertisement/AdvertisementForm";
import { FormValues } from "@/types/advertisement";
import { toast } from "sonner";

const EditarAnuncio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [advertisementData, setAdvertisementData] = useState<FormValues | null>(null);
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
              photo_url
            ),
            advertisement_videos (
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

        const formattedData: FormValues = {
          id: advertisement.id, // Importante: incluir o ID aqui
          name: advertisement.name,
          birthDate: advertisement.birth_date,
          height: advertisement.height,
          weight: advertisement.weight,
          category: advertisement.category,
          ethnicity: advertisement.ethnicity,
          hairColor: advertisement.hair_color,
          bodyType: advertisement.body_type,
          silicone: advertisement.silicone,
          whatsapp: advertisement.whatsapp,
          state: advertisement.state,
          city: advertisement.city,
          neighborhood: advertisement.neighborhood,
          hourlyRate: advertisement.hourly_rate,
          customRates: advertisement.custom_rate_description
            ? JSON.parse(advertisement.custom_rate_description)
            : [],
          style: advertisement.style,
          services: advertisement.advertisement_services?.map((s: any) => s.service) || [],
          serviceLocations: advertisement.advertisement_service_locations?.map((l: any) => l.location) || [],
          description: advertisement.description,
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