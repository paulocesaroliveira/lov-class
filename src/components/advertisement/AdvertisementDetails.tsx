import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Heart } from "lucide-react";

type AdvertisementDetailsProps = {
  advertisement: any;
  onWhatsAppClick: () => void;
};

export const AdvertisementDetails = ({ advertisement, onWhatsAppClick }: AdvertisementDetailsProps) => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleChatClick = async () => {
    if (!session?.user) {
      navigate("/login");
      return;
    }

    try {
      console.log("Starting chat creation process...");
      console.log("Current user:", {
        id: session.user.id,
        email: session.user.email
      });
      console.log("Advertisement details:", {
        id: advertisement.id,
        profile_id: advertisement.profile_id,
        name: advertisement.name
      });

      // Create conversation and get participants in one go
      const { data: conversationData, error: conversationError } = await supabase
        .rpc('find_or_create_conversation', {
          current_user_id: session.user.id,
          other_user_id: advertisement.profile_id
        });

      if (conversationError) {
        console.error('Error creating/finding conversation:', conversationError);
        throw conversationError;
      }

      if (!conversationData || conversationData.length === 0) {
        throw new Error('No conversation data returned');
      }

      const conversationId = conversationData[0].conversation_id;
      console.log("Conversation created/found:", conversationId);
      
      // Add advertisement reference if it doesn't exist
      const { error: participantError } = await supabase
        .from('conversation_participants')
        .update({ advertisement_id: advertisement.id })
        .eq('conversation_id', conversationId)
        .eq('user_id', session.user.id);

      if (participantError) {
        console.error('Error updating participant:', participantError);
        // Don't throw here, just log the error as it's not critical
      }

      navigate(`/mensagens/${conversationId}`);
    } catch (error: any) {
      console.error('Error in handleChatClick:', error);
      toast.error("Erro ao iniciar conversa");
    }
  };

  // Format the hourly rate with a fallback to 0
  const formattedHourlyRate = advertisement?.hourly_rate != null 
    ? Number(advertisement.hourly_rate).toFixed(2) 
    : "0.00";

  // Parse custom rates from JSON string
  const customRates = advertisement?.custom_rate_description 
    ? JSON.parse(advertisement.custom_rate_description)
    : [];

  return (
    <div className="space-y-6">
      {/* Valores */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Valores</h2>
        <div className="space-y-2">
          <div>
            <span className="text-sm text-muted-foreground">Valor por hora</span>
            <p className="text-xl font-semibold">
              R$ {formattedHourlyRate}
            </p>
          </div>

          {customRates.map((rate: { description: string; value: number }, index: number) => (
            <div key={index}>
              <span className="text-sm text-muted-foreground">
                {rate.description}
              </span>
              <p className="text-xl font-semibold">
                R$ {Number(rate.value).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col gap-4">
        <Button 
          className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90" 
          onClick={handleChatClick}
        >
          Chat privado
        </Button>
        <Button 
          className="w-full bg-whatsapp hover:bg-whatsapp/90" 
          onClick={onWhatsAppClick}
        >
          WhatsApp
        </Button>
      </div>
    </div>
  );
};