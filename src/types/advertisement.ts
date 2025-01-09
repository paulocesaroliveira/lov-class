import { z } from "zod";
import { formSchema } from "@/components/advertisement/advertisementSchema";

export type FormValues = z.infer<typeof formSchema>;

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
  birth_date: string;
  height: number;
  weight: number;
  ethnicity: string;
  hair_color: string;
  body_type: string;
  silicone: string;
  contact_phone: string;
  contact_whatsapp: boolean;
  contact_telegram: boolean;
  hourly_rate: number;
  custom_rate_description: string | null;
  custom_rate_value: number | null;
  style: string;
  category: "mulher" | "trans" | "homem";
  advertisement_services: Array<{
    id: string;
    advertisement_id: string;
    service: ServiceType;
    created_at: string;
  }>;
  advertisement_service_locations: Array<{
    id: string;
    advertisement_id: string;
    location: ServiceLocationType;
    created_at: string;
  }>;
  advertisement_photos: Array<{
    id: string;
    advertisement_id: string;
    photo_url: string;
    created_at: string;
  }>;
  advertisement_videos: Array<{
    id: string;
    advertisement_id: string;
    video_url: string;
    created_at: string;
  }>;
  advertisement_comments: Array<{
    id: string;
    advertisement_id: string;
    user_id: string;
    comment: string;
    rating: number | null;
    created_at: string;
  }>;
  advertisement_reviews: Array<{
    id: string;
    advertisement_id: string;
    reviewer_id: string;
    review_notes: string | null;
    block_reason: string | null;
    created_at: string;
    updated_at: string;
    status: string;
  }>;
}