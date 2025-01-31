export type AdStatus = 'pending_review' | 'approved' | 'rejected' | 'blocked';
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
  birth_date: string;
  height: number;
  weight: number;
  category: AdCategory;
  ethnicity: string;
  hair_color: string;
  body_type: string;
  silicone: string;
  contact_phone: string;
  contact_whatsapp: boolean;
  contact_telegram: boolean;
  state: string;
  city: string;
  neighborhood: string;
  hourly_rate: number;
  custom_rate_description?: string;
  custom_rate_value?: number;
  style: string;
  profile_photo_url?: string;
  moderation_status: AdStatus;
  blocked?: boolean;
  block_reason?: string;
  created_at: string;
  updated_at: string;
  advertisement_photos?: AdvertisementPhoto[];
  advertisement_videos?: AdvertisementVideo[];
  advertisement_services?: AdvertisementService[];
  advertisement_service_locations?: AdvertisementServiceLocation[];
  advertisement_comments?: AdvertisementComment[];
  advertisement_reviews?: AdvertisementReview[];
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
  moderation_status: AdStatus;
  review_notes?: string;
  block_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface FormValues {
  id?: string;
  name: string;
  description: string;
  birth_date: string;
  height: number;
  weight: number;
  category: AdCategory;
  ethnicity: string;
  hair_color: string;
  body_type: string;
  silicone: string;
  contact_phone: string;
  contact_whatsapp: boolean;
  contact_telegram: boolean;
  state: string;
  city: string;
  neighborhood: string;
  hourly_rate: number;
  custom_rates?: Array<{
    description: string;
    value: number;
  }>;
  style: string;
  services: ServiceType[];
  service_locations: ServiceLocationType[];
  profile_photo?: File;
  photos?: File[];
  videos?: File[];
  identity_document?: File;
  accept_terms: boolean;
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