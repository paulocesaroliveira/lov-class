export interface Advertisement {
  id: string;
  name: string;
  description: string | null;
  block_reason: string | null;
  created_at: string;
  updated_at: string;
  city: string | null;
  neighborhood: string | null;
  status: string;
  profile_id: string;
  advertisement_services: AdvertisementService[];
  advertisement_service_locations: AdvertisementServiceLocation[];
  advertisement_photos: AdvertisementPhoto[];
  advertisement_videos: AdvertisementVideo[];
  advertisement_comments: AdvertisementComment[];
  advertisement_reviews: AdvertisementReview[];
}

export interface AdvertisementService {
  id: string;
  advertisement_id: string;
  service: ServiceType;
  created_at: string;
}

export interface AdvertisementServiceLocation {
  id: string;
  advertisement_id: string;
  location: ServiceLocationType;
  created_at: string;
}

export interface AdvertisementPhoto {
  id: string;
  advertisement_id: string;
  photo_url: string;
  created_at: string;
}

export interface AdvertisementVideo {
  id: string;
  advertisement_id: string;
  video_url: string;
  created_at: string;
}

export interface AdvertisementComment {
  id: string;
  advertisement_id: string;
  user_id: string;
  comment: string;
  rating: number | null;
  created_at: string;
}

export interface AdvertisementReview {
  id: string;
  advertisement_id: string;
  reviewer_id: string;
  review_notes: string | null;
  block_reason: string | null;
  created_at: string;
  updated_at: string;
  status: string;
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
  identityDocument?: File;
  profilePhoto?: File;
  photos?: File[];
  videos?: File[];
}