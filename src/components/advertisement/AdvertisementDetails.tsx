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
      // Primeiro, buscar as conversas do anunciante
      const { data: advertiserConversations, error: advertiserError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', advertisement.profile_id);

      if (advertiserError) throw advertiserError;

      const conversationIds = advertiserConversations?.map(c => c.conversation_id) || [];

      if (conversationIds.length > 0) {
        // Depois, verificar se o usuário atual participa de alguma dessas conversas
        const { data: existingConversation, error: participantError } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', session.user.id)
          .in('conversation_id', conversationIds)
          .maybeSingle();

        if (participantError) throw participantError;

        if (existingConversation) {
          navigate(`/mensagens/${existingConversation.conversation_id}`);
          return;
        }
      }

      // Create new conversation
      const { data: newConversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({})
        .select()
        .single();

      if (conversationError) throw conversationError;

      // Add participants
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: newConversation.id, user_id: session.user.id },
          { conversation_id: newConversation.id, user_id: advertisement.profile_id }
        ]);

      if (participantsError) throw participantsError;

      // Navigate to new conversation
      navigate(`/mensagens/${newConversation.id}`);
      
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
  );
};
