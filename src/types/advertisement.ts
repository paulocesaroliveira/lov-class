export interface FormValues {
  id?: string;
  name: string;
  birthDate: string;
  height: number;
  weight: number;
  category: "mulher" | "trans" | "homem";
  ethnicity: string;
  hairColor: string;
  bodyType: string;
  silicone: string;
  contact_phone: string;
  contact_whatsapp: boolean;
  contact_telegram: boolean;
  state: string;
  city: string;
  neighborhood: string;
  hourlyRate: number;
  customRates: Array<{
    description: string;
    value: number;
  }>;
  style: string;
  services: ServiceType[];
  serviceLocations: ServiceLocationType[];
  description: string;
  acceptTerms: boolean;
  identityDocument?: File | null;
  profilePhoto?: File | null;
  photos?: File[] | null;
  videos?: File[] | null;
}

export type ServiceType =
  | "beijo_na_boca"
  | "beijo_grego"
  | "bondage"
  | "chuva_dourada"
  | "chuva_marrom"
  | "dominacao"
  | "acessorios_eroticos"
  | "voyeurismo"
  | "permite_filmagem"
  | "menage_casal"
  | "menage_dois_homens"
  | "roleplay"
  | "facefuck"
  | "oral_sem_preservativo"
  | "oral_com_preservativo"
  | "massagem"
  | "sexo_virtual"
  | "orgia"
  | "gangbang";

export type ServiceLocationType =
  | "com_local"
  | "motel"
  | "clube_swing"
  | "domicilio"
  | "viagens";