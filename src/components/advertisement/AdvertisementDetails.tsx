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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold">{advertisement.name}</h3>
        <p className="text-muted-foreground">
          {advertisement.city}, {advertisement.state}
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Altura</p>
            <p className="font-medium">{advertisement.height}m</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Peso</p>
            <p className="font-medium">{advertisement.weight}kg</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Valor por hora</p>
          <p className="font-medium">
            R$ {advertisement.hourly_rate.toFixed(2)}
          </p>
        </div>

        {advertisement.custom_rate_description && (
          <div>
            <p className="text-sm text-muted-foreground">
              {advertisement.custom_rate_description}
            </p>
            <p className="font-medium">
              R$ {advertisement.custom_rate_value.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="font-medium">Descrição</p>
        <p className="text-muted-foreground whitespace-pre-wrap">
          {advertisement.description}
        </p>
      </div>

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