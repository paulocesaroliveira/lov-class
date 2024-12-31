import { PlusCircle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AdvertisementSectionProps {
  hasAd: boolean;
  advertisementId: string | null;
}

export const AdvertisementSection = ({ hasAd, advertisementId }: AdvertisementSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-4">Meu Anúncio</h2>
      
      {hasAd ? (
        <Button
          onClick={() => navigate(`/editar-anuncio/${advertisementId}`)}
          className="w-full sm:w-auto"
        >
          <Edit className="w-4 h-4 mr-2" />
          Editar Anúncio
        </Button>
      ) : (
        <Button
          onClick={() => navigate("/criar-anuncio")}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Criar Anúncio
        </Button>
      )}
    </div>
  );
};