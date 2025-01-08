import { AdStatus } from "@/integrations/supabase/types/enums";

export interface AdvertisementPhoto {
  id: string;
  photo_url: string;
}

export interface AdvertisementService {
  id: string;
  service: string;
}

export interface AdvertisementServiceLocation {
  id: string;
  location: string;
}

export interface AdvertisementReview {
  status: AdStatus;
  review_notes: string;
  block_reason: string;
  created_at: string;
  updated_at: string;
}

export interface Advertisement {
  id: string;
  profile_id: string;
  name: string;
  description: string | null;
  block_reason: string | null;
  created_at: string;
  updated_at: string;
  city: string | null;
  neighborhood: string | null;
  status: AdStatus;
  advertisement_photos: AdvertisementPhoto[];
  advertisement_services: AdvertisementService[];
  advertisement_service_locations: AdvertisementServiceLocation[];
  advertisement_reviews: AdvertisementReview[];
}