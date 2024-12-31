import { AdvertisementForm } from "@/components/advertisement/AdvertisementForm";

const CriarAnuncio = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Criar Anúncio</h1>
        <p className="text-muted-foreground">
          Preencha os campos abaixo para criar seu anúncio
        </p>
      </div>

      <AdvertisementForm />
    </div>
  );
};

export default CriarAnuncio;