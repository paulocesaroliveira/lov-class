import { ModerationStatus } from "@/integrations/supabase/types/enums";

export type AdCategory = 'mulher' | 'trans' | 'homem';

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
  hourly_rate: number;
  custom_rate_description?: string;
  custom_rate_value?: number;
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

export interface AdvertisementListProps {
  advertisements: Advertisement[];
  isLoading: boolean;
  isFavoritesPage?: boolean;
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

export type { ServiceType, ServiceLocationType } from "@/integrations/supabase/types/enums";