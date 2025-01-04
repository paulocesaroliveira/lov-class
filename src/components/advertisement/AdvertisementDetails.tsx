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
      const { data, error } = await supabase
        .rpc('find_or_create_conversation', {
          current_user_id: session.user.id,
          other_user_id: advertisement.profile_id
        });

      if (error) throw error;

      navigate(`/mensagens/${data[0].conversation_id}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error("Erro ao iniciar conversa");
    }
  };

  // Format the hourly rate with a fallback to 0
  const formattedHourlyRate = advertisement?.hourly_rate != null 
    ? Number(advertisement.hourly_rate).toFixed(2) 
    : "0.00";

  // Format the custom rate with a fallback to 0
  const formattedCustomRate = advertisement?.custom_rate_value != null 
    ? Number(advertisement.custom_rate_value).toFixed(2) 
    : "0.00";

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

          {advertisement?.custom_rate_description && (
            <div>
              <span className="text-sm text-muted-foreground">
                {advertisement.custom_rate_description}
              </span>
              <p className="text-xl font-semibold">
                R$ {formattedCustomRate}
              </p>
            </div>
          )}
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
          className="w-full" 
          variant="secondary" 
          onClick={onWhatsAppClick}
        >
          WhatsApp
        </Button>
      </div>
    </div>
  );
};