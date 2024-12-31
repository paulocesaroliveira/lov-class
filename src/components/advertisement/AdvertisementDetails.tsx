import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { ServiceLocations } from "./ServiceLocations";
import { ServicesSelection } from "./ServicesSelection";

type AdvertisementDetailsProps = {
  advertisement: any;
  onWhatsAppClick: () => void;
};

export const AdvertisementDetails = ({ advertisement, onWhatsAppClick }: AdvertisementDetailsProps) => {
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
                R$ {advertisement.hourly_rate.toFixed(2)}
              </p>
            </div>
            {advertisement.custom_rate_description && (
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
            form={undefined}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Serviços</h3>
          <ServicesSelection
            form={undefined}
          />
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={onWhatsAppClick}
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          Chamar no WhatsApp
        </Button>
      </div>
    </div>
  );
};