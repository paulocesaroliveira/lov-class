import { z } from "zod";
import { formSchema } from "@/components/advertisement/advertisementSchema";
import { Database } from "@/integrations/supabase/types";

type ServiceType = Database["public"]["Enums"]["service_type"];
type ServiceLocationType = Database["public"]["Enums"]["service_location_type"];

export type StyleType = z.infer<typeof formSchema>["style"];
export type FormValues = z.infer<typeof formSchema> & {
  id?: string;
};

export interface Advertisement {
  id: string;
  profile_id: string;
  name: string;
  birth_date: string;
  height: number;
  weight: number;
  category: "mulher" | "trans" | "homem";
  whatsapp: string;
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
  blocked?: boolean | null;
  block_reason?: string | null;
  advertisement_services: { service: ServiceType }[];
  advertisement_service_locations: { location: ServiceLocationType }[];
  advertisement_photos: { id: string; photo_url: string }[];
  advertisement_videos: { id: string; video_url: string }[];
  advertisement_comments: { id: string }[];
}