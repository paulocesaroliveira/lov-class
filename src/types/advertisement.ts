export interface Filters {
  minAge?: number;
  maxAge?: number;
  minPrice?: number;
  maxPrice?: number;
  services?: string[];
  locations?: string[];
  style?: string;
  category?: string;
}

export interface Advertisement {
  id: string;
  name: string;
  description: string;
  birth_date: string;
  height: number;
  weight: number;
  ethnicity: string;
  hair_color: string;
  body_type: string;
  silicone: string;
  city: string;
  neighborhood: string;
  state: string;
  hourly_rate: number;
  custom_rate_description?: string;
  custom_rate_value?: number;
  style: string;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
  profile_id: string;
  profile: {
    id: string;
    name: string;
  };
  advertisement_services: Array<{ service: string }>;
  advertisement_service_locations: Array<{ location: string }>;
  advertisement_photos: Array<{ photo_url: string }>;
  advertisement_videos: Array<{ video_url: string }>;
  advertisement_comments: Array<{
    id: string;
    comment: string;
    rating: number;
    created_at: string;
  }>;
}

export interface AdvertisementResponse {
  data: Advertisement[];
  totalCount: number;
}