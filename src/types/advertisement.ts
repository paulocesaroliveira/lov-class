import { z } from "zod";
import { formSchema } from "@/components/advertisement/advertisementSchema";
import { ServiceType, ServiceLocationType } from "@/integrations/supabase/types/enums";

export type StyleType = z.infer<typeof formSchema>["style"];
export type FormValues = z.infer<typeof formSchema> & {
  id?: string;
  identityDocument?: File;
};

export type AdvertisementStatus = 'pending' | 'approved' | 'blocked';

export interface Advertisement {
  id: string;
  profile_id: string;
  name: string;
  birth_date: string;
  height: number;
  weight: number;
  category: "mulher" | "trans" | "homem";
  contact_phone: string;
  contact_whatsapp: boolean;
  contact_telegram: boolean;
  state: string;
  city: string;
  neighborhood: string;
  hourly_rate: number;
  custom_rate_description: string;
  custom_rate_value: number | null;
  description: string;
  profile_photo_url: string | null;
  created_at: string;
  updated_at: string;
  style: string;
  ethnicity: string;
  hair_color: string;
  body_type: string;
  silicone: string;
  status: AdvertisementStatus;
  advertisement_photos?: { id: string; photo_url: string }[];
  advertisement_videos?: { id: string; video_url: string }[];
  advertisement_services: { service: ServiceType }[];
  advertisement_service_locations: { location: ServiceLocationType }[];
  advertisement_comments: { id: string }[];
  advertisement_reviews?: {
    status: string;
    review_notes: string | null;
    block_reason: string | null;
    updated_at: string;
  }[];
}

export type { ServiceType, ServiceLocationType };