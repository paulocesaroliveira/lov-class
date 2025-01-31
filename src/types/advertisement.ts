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

export interface CustomRate {
  description: string;
  value: number;
}

export interface FormValues {
  id?: string;
  name: string;
  birth_date: string;
  body_type: string;
  category: AdCategory;
  city: string;
  contact_phone: string;
  contact_telegram: boolean;
  contact_whatsapp: boolean;
  description: string;
  ethnicity: string;
  hair_color: string;
  height: number;
  weight: number;
  hourly_rate: number;
  neighborhood: string;
  profile_photo_url?: string;
  silicone: string;
  state: string;
  style: string;
  custom_rates: CustomRate[];
  services: ServiceType[];
  serviceLocations: ServiceLocationType[];
  photos?: File[];
  videos?: File[];
  identityDocument?: File;
  acceptTerms: boolean;
}

export interface Advertisement {
  id: string;
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
  created_at: string;
  updated_at: string;
  advertisement_services?: { service: ServiceType }[];
  advertisement_service_locations?: { location: ServiceLocationType }[];
}

export interface Filters {
  city?: string;
  state?: string;
  category?: AdCategory;
  minPrice?: number;
  maxPrice?: number;
  serviceLocations?: ServiceLocationType[];
}

export interface AdvertisementListProps {
  advertisements: Advertisement[];
  isLoading?: boolean;
  isFavoritesPage?: boolean;
}

export interface MediaPreview {
  id: string;
  url: string;
  type: 'photo' | 'video';
  file: File;
}