import { ModerationStatus } from "@/integrations/supabase/types/enums";

export type AdCategory = 'mulher' | 'trans' | 'homem';

export type ServiceType = 
  | 'beijo_na_boca'
  | 'beijo_grego'
  | 'bondage'
  | 'chuva_dourada'
  | 'chuva_marrom'
  | 'dominacao'
  | 'acessorios_eroticos'
  | 'voyeurismo'
  | 'permite_filmagem'
  | 'menage_casal'
  | 'menage_dois_homens'
  | 'roleplay'
  | 'facefuck'
  | 'oral_sem_preservativo'
  | 'oral_com_preservativo'
  | 'massagem'
  | 'sexo_virtual'
  | 'orgia'
  | 'gangbang';

export type ServiceLocationType = 
  | 'com_local'
  | 'motel'
  | 'clube_swing'
  | 'domicilio'
  | 'viagens';

export interface Advertisement {
  id: string;
  profile_id: string;
  name: string;
  description: string;
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
  customRates?: Array<{
    description: string;
    value: number;
  }>;
  style: string;
  profile_photo_url?: string;
  moderation_status: ModerationStatus;
  blocked?: boolean;
  block_reason?: string;
  created_at: string;
  updated_at: string;
  advertisement_photos?: AdvertisementPhoto[];
  advertisement_videos?: AdvertisementVideo[];
  advertisement_services?: { service: ServiceType }[];
  advertisement_service_locations?: { location: ServiceLocationType }[];
}

export interface FormValues {
  id?: string;
  name: string;
  description: string;
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
  customRates?: Array<{
    description: string;
    value: number;
  }>;
  style: string;
  services: ServiceType[];
  service_locations: ServiceLocationType[];
  profilePhoto?: File;
  photos?: File[];
  videos?: File[];
  identityDocument?: File;
  acceptTerms: boolean;
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

export interface AdvertisementService {
  advertisement_id: string;
  service: ServiceType;
}

export interface AdvertisementServiceLocation {
  advertisement_id: string;
  location: ServiceLocationType;
}

export interface AdvertisementComment {
  id: string;
  advertisement_id: string;
  user_id: string;
  comment: string;
  rating?: number;
  created_at: string;
  updated_at: string;
}

export interface AdvertisementReview {
  id: string;
  advertisement_id: string;
  reviewer_id?: string;
  moderation_status: ModerationStatus;
  review_notes?: string;
  block_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface Filters {
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  services?: ServiceType[];
  service_locations?: ServiceLocationType[];
  category?: AdCategory;
}