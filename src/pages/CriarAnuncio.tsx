import { AdvertisementForm } from "@/components/advertisement/AdvertisementForm";
import { FormValues } from "@/types/advertisement";

const defaultValues: Partial<FormValues> = {
  name: "",
  birthDate: "",
  height: 170,
  weight: 65,
  category: "mulher",
  ethnicity: "branca",
  hairColor: "morena",
  bodyType: "magra",
  silicone: "nao_uso",
  contact_phone: "",
  contact_whatsapp: true,
  contact_telegram: false,
  state: "",
  city: "",
  neighborhood: "",
  hourlyRate: 200,
  customRates: [],
  style: "patricinha",
  services: [],
  serviceLocations: [],
  description: "",
  acceptTerms: false,
};

const CriarAnuncio = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Criar Anúncio</h1>
      <AdvertisementForm defaultValues={defaultValues} />
    </div>
  );
};

export default CriarAnuncio;