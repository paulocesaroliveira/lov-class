import { Button } from "@/components/ui/button";
import { MessageSquare, MessageCircle } from "lucide-react";
import { ServiceLocations } from "./ServiceLocations";
import { ServicesSelection } from "./ServicesSelection";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type AdvertisementDetailsProps = {
  advertisement: any;
  onWhatsAppClick: () => void;
};

export const AdvertisementDetails = ({ advertisement, onWhatsAppClick }: AdvertisementDetailsProps) => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const startPrivateChat = async () => {
    if (!session?.user) {
      toast.error("Faça login para iniciar um chat privado");
      return;
    }

    try {
      const { data: existingConversation, error: existingError } = await supabase
        .rpc('find_or_create_conversation', {
          current_user_id: session.user.id,
          other_user_id: advertisement.profile_id
        }) as { data: { conversation_id: string }[] | null, error: any };

      if (existingError) throw existingError;
      if (!existingConversation?.[0]) throw new Error("Failed to create conversation");

      // Navigate to the conversation
      navigate(`/mensagens/${existingConversation[0].conversation_id}`);
    } catch (error: any) {
      console.error('Error starting chat:', error);
      toast.error(error.message || "Erro ao iniciar chat privado");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Sobre</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {advertisement.description}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Características</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-sm font-medium">Altura:</span>
              <p className="text-muted-foreground">{advertisement.height}cm</p>
            </div>
            <div>
              <span className="text-sm font-medium">Peso:</span>
              <p className="text-muted-foreground">{advertisement.weight}kg</p>
            </div>
            <div>
              <span className="text-sm font-medium">Etnia:</span>
              <p className="text-muted-foreground">{advertisement.ethnicity}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Cor do cabelo:</span>
              <p className="text-muted-foreground">{advertisement.hair_color}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Tipo físico:</span>
              <p className="text-muted-foreground">{advertisement.body_type}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Silicone:</span>
              <p className="text-muted-foreground">{advertisement.silicone}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Valores</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium">1 hora:</span>
              <p className="text-muted-foreground">
                R$ {advertisement.hourly_rate ? advertisement.hourly_rate.toFixed(2) : '0.00'}
              </p>
            </div>
            {advertisement.custom_rate_description && advertisement.custom_rate_value && (
              <div>
                <span className="text-sm font-medium">
                  {advertisement.custom_rate_description}:
                </span>
                <p className="text-muted-foreground">
                  R$ {advertisement.custom_rate_value.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Locais de Atendimento</h3>
          <ServiceLocations
            locations={advertisement.advertisement_service_locations}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Serviços</h3>
          <ServicesSelection
            services={advertisement.advertisement_services}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Button
            className="w-full bg-whatsapp hover:bg-whatsapp/90"
            size="lg"
            onClick={onWhatsAppClick}
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Chamar no WhatsApp
          </Button>

          {session && session.user.id !== advertisement.profile_id && (
            <Button
              variant="outline"
              className="w-full"
              size="lg"
              onClick={startPrivateChat}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Iniciar Chat Privado
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};