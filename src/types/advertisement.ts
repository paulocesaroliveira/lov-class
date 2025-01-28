export type AdCategory = "mulher" | "trans" | "homem";
export type AdStatus = "pending" | "approved" | "blocked";

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

export interface FormValues {
  id?: string;
  name: string;
  birthDate: string;
  height: number;
  weight: number;
  category: AdCategory;
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
  identityDocument?: File;
  profilePhoto?: File;
  photos?: File[];
  videos?: File[];
  status?: AdStatus;
}

export interface Filters {
  category?: AdCategory;
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  minAge?: number;
  maxAge?: number;
  minHeight?: number;
  maxHeight?: number;
  minWeight?: number;
  maxWeight?: number;
  ethnicity?: string;
  hairColor?: string;
  bodyType?: string;
  services?: ServiceType[];
  serviceLocations?: ServiceLocationType[];
  style?: string;
}

export interface AdvertisementListProps {
  advertisements: Advertisement[];
  isLoading: boolean;
  isFavoritesPage?: boolean;
  onSelectAd?: (ad: Advertisement) => void;
}

export interface Advertisement {
  id: string;
  name: string;
  description: string;
  birth_date: string;
  height: number;
  weight: number;
  ethnicity: string;
  hair_color: string;
  body_type: string;
  silicone: string;
  city: string;
  state: string;
  neighborhood: string;
  hourly_rate: number;
  custom_rate_description?: string;
  custom_rate_value?: number;
  style: string;
  category: AdCategory;
  status: AdStatus;
  created_at: string;
  updated_at: string;
  profile_id: string;
  contact_phone: string;
  contact_whatsapp: boolean;
  contact_telegram: boolean;
  profile_photo_url?: string;
  advertisement_services: Array<{ service: ServiceType }>;
  advertisement_service_locations: Array<{ location: ServiceLocationType }>;
  advertisement_photos: Array<{ photo_url: string }>;
  advertisement_videos: Array<{ video_url: string }>;
  advertisement_reviews: Array<{
    id: string;
    status: string;
    review_notes: string | null;
    updated_at: string;
  }>;
}