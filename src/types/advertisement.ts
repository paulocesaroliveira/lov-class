import { z } from "zod";
import { formSchema } from "@/components/advertisement/advertisementSchema";
import { ServiceType, ServiceLocationType, AdStatus } from "@/integrations/supabase/types/database/enums";

export type StyleType = z.infer<typeof formSchema>["style"];
export type FormValues = z.infer<typeof formSchema> & {
  id?: string;
  identityDocument?: File;
};

export interface Advertisement {
  id: string;
  profile_id: string;
  name: string;
  description: string;
  status: AdStatus;
  block_reason: string | null;
  created_at: string;
  updated_at: string;
  advertisement_photos?: { id: string; photo_url: string }[];
  advertisement_videos?: { id: string; video_url: string }[];
  advertisement_services: { service: ServiceType }[];
  advertisement_service_locations: { location: ServiceLocationType }[];
  advertisement_comments: { id: string }[];
  advertisement_reviews?: {
    status: AdStatus;
    review_notes: string | null;
    block_reason: string | null;
    created_at: string;
  }[];
}

export type { ServiceType, ServiceLocationType };