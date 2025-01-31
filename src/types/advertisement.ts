import { ServiceType, ServiceLocationType, AdCategory, ModerationStatus } from "@/integrations/supabase/types/database/enums";

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
  type: 'image' | 'video';
}