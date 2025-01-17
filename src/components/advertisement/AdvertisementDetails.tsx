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
          className="w-full bg-whatsapp hover:bg-whatsapp/90" 
          onClick={onWhatsAppClick}
        >
          WhatsApp
        </Button>
      </div>
    </div>
  );
};