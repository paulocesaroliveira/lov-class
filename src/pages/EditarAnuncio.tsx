import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAdvertisement } from "@/hooks/useAdvertisement";
import { AdvertisementForm } from "@/components/advertisement/AdvertisementForm";

const EditarAnuncio = () => {
  const { id } = useParams();
  const { data: advertisement, isLoading: isLoadingAd } = useAdvertisement(id);

  if (isLoadingAd) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!advertisement) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Anúncio não encontrado
        </h2>
        <p className="mt-2 text-gray-600">
          O anúncio que você está procurando não existe ou foi removido.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Editar Anúncio</h1>
        <p className="text-muted-foreground">
          Atualize as informações do seu anúncio abaixo
        </p>
      </div>

      <AdvertisementForm advertisement={advertisement} />
    </div>
  );
};

export default EditarAnuncio;