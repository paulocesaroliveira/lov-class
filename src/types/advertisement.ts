import { ServiceType, ServiceLocationType, AdCategory } from "@/integrations/supabase/types/database/enums";

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
  custom_rates: Array<{
    description: string;
    value: number;
  }>;
  style: string;
  services: ServiceType[];
  serviceLocations: ServiceLocationType[];
  profile_photo?: File;
  photos?: File[];
  videos?: File[];
  identityDocument?: File;
  acceptTerms: boolean;
}

export interface MediaPreview {
  id: string;
  file: File;
  url: string;
  type: "image" | "video";
}

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
  moderation_status?: string;
  blocked?: boolean;
  block_reason?: string;
  created_at: string;
  updated_at: string;
  advertisement_services?: { service: ServiceType }[];
  advertisement_service_locations?: { location: ServiceLocationType }[];
  advertisement_photos?: { id: string; photo_url: string }[];
  advertisement_videos?: { id: string; video_url: string }[];
}

export interface AdvertisementListProps {
  advertisements: Advertisement[];
  isLoading?: boolean;
  isFavoritesPage?: boolean;
}

export interface Filters {
  category?: AdCategory;
  state?: string;
  city?: string;
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

export type { ServiceType, ServiceLocationType, AdCategory };