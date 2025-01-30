import { ServiceType, ServiceLocationType, AdCategory, UserRole, ModerationStatus } from './enums';

export interface Database {
  public: {
    Tables: {
      advertisements: {
        Row: {
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
          moderation_status: ModerationStatus;
          blocked?: boolean;
          block_reason?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
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
          contact_whatsapp?: boolean;
          contact_telegram?: boolean;
          state: string;
          city: string;
          neighborhood: string;
          hourly_rate: number;
          custom_rate_description?: string;
          custom_rate_value?: number;
          style: string;
          profile_photo_url?: string;
          moderation_status?: ModerationStatus;
          blocked?: boolean;
          block_reason?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          name?: string;
          description?: string;
          birth_date?: string;
          height?: number;
          weight?: number;
          category?: AdCategory;
          ethnicity?: string;
          hair_color?: string;
          body_type?: string;
          silicone?: string;
          contact_phone?: string;
          contact_whatsapp?: boolean;
          contact_telegram?: boolean;
          state?: string;
          city?: string;
          neighborhood?: string;
          hourly_rate?: number;
          custom_rate_description?: string;
          custom_rate_value?: number;
          style?: string;
          profile_photo_url?: string;
          moderation_status?: ModerationStatus;
          blocked?: boolean;
          block_reason?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_blocks: {
        Row: {
          user_id: string;
          blocked_user_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          blocked_user_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          blocked_user_id?: string;
          created_at?: string;
        };
      };
      advertisement_comments: {
        Row: {
          advertisement_id: string;
          comment: string;
          created_at: string;
          id: string;
          rating: number | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          advertisement_id: string;
          comment: string;
          created_at?: string;
          id?: string;
          rating?: number | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          advertisement_id?: string;
          comment?: string;
          created_at?: string;
          id?: string;
          rating?: number | null;
          updated_at?: string;
          user_id?: string;
        };
      };
      advertisement_photos: {
        Row: {
          advertisement_id: string;
          created_at: string;
          id: string;
          photo_url: string;
        };
        Insert: {
          advertisement_id: string;
          created_at?: string;
          id?: string;
          photo_url: string;
        };
        Update: {
          advertisement_id?: string;
          created_at?: string;
          id?: string;
          photo_url?: string;
        };
      };
      advertisement_videos: {
        Row: {
          advertisement_id: string;
          created_at: string;
          id: string;
          video_url: string;
        };
        Insert: {
          advertisement_id: string;
          created_at?: string;
          id?: string;
          video_url: string;
        };
        Update: {
          advertisement_id?: string;
          created_at?: string;
          id?: string;
          video_url?: string;
        };
      };
      advertisement_reviews: {
        Row: {
          advertisement_id: string;
          created_at: string;
          id: string;
          moderation_message: string | null;
          review_notes: string | null;
          reviewer_id: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          advertisement_id: string;
          created_at?: string;
          id?: string;
          moderation_message?: string | null;
          review_notes?: string | null;
          reviewer_id?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          advertisement_id?: string;
          created_at?: string;
          id?: string;
          moderation_message?: string | null;
          review_notes?: string | null;
          reviewer_id?: string | null;
          status?: string;
          updated_at?: string;
        };
      };
      advertisement_service_locations: {
        Row: {
          advertisement_id: string;
          location: ServiceLocationType;
        };
        Insert: {
          advertisement_id: string;
          location: ServiceLocationType;
        };
        Update: {
          advertisement_id?: string;
          location?: ServiceLocationType;
        };
      };
      advertisement_services: {
        Row: {
          advertisement_id: string;
          service: ServiceType;
        };
        Insert: {
          advertisement_id: string;
          service: ServiceType;
        };
        Update: {
          advertisement_id?: string;
          service?: ServiceType;
        };
      };
      advertisement_views: {
        Row: {
          advertisement_id: string;
          id: string;
          viewed_at: string;
        };
        Insert: {
          advertisement_id: string;
          id?: string;
          viewed_at?: string;
        };
        Update: {
          advertisement_id?: string;
          id?: string;
          viewed_at?: string;
        };
      };
      advertisement_whatsapp_clicks: {
        Row: {
          advertisement_id: string;
          clicked_at: string;
          id: string;
        };
        Insert: {
          advertisement_id: string;
          clicked_at?: string;
          id?: string;
        };
        Update: {
          advertisement_id?: string;
          clicked_at?: string;
          id?: string;
        };
      };
    };
    Enums: {
      service_type: ServiceType;
      service_location_type: ServiceLocationType;
      ad_category: AdCategory;
      user_role: UserRole;
      moderation_status: ModerationStatus;
    };
  };
}
