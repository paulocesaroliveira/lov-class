export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      advertisements: {
        Row: {
          id: string
          profile_id: string
          name: string
          description: string
          birth_date: string
          height: number
          weight: number
          category: 'mulher' | 'trans' | 'homem'
          ethnicity: string
          hair_color: string
          body_type: string
          silicone: string
          contact_phone: string
          contact_whatsapp: boolean
          contact_telegram: boolean
          state: string
          city: string
          neighborhood: string
          hourly_rate: number
          custom_rate_description?: string
          custom_rate_value?: number
          style: string
          profile_photo_url?: string
          moderation_status: 'pending_review' | 'approved' | 'rejected' | 'blocked'
          blocked: boolean
          block_reason?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          name: string
          description: string
          birth_date: string
          height: number
          weight: number
          category: 'mulher' | 'trans' | 'homem'
          ethnicity: string
          hair_color: string
          body_type: string
          silicone: string
          contact_phone: string
          contact_whatsapp?: boolean
          contact_telegram?: boolean
          state: string
          city: string
          neighborhood: string
          hourly_rate: number
          custom_rate_description?: string
          custom_rate_value?: number
          style: string
          profile_photo_url?: string
          moderation_status?: 'pending_review' | 'approved' | 'rejected' | 'blocked'
          blocked?: boolean
          block_reason?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          name?: string
          description?: string
          birth_date?: string
          height?: number
          weight?: number
          category?: 'mulher' | 'trans' | 'homem'
          ethnicity?: string
          hair_color?: string
          body_type?: string
          silicone?: string
          contact_phone?: string
          contact_whatsapp?: boolean
          contact_telegram?: boolean
          state?: string
          city?: string
          neighborhood?: string
          hourly_rate?: number
          custom_rate_description?: string
          custom_rate_value?: number
          style?: string
          profile_photo_url?: string
          moderation_status?: 'pending_review' | 'approved' | 'rejected' | 'blocked'
          blocked?: boolean
          block_reason?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "advertisements_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
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
        Relationships: [
          {
            foreignKeyName: "advertisement_comments_advertisement_id_fkey";
            columns: ["advertisement_id"];
            isOneToOne: false;
            referencedRelation: "advertisements";
            referencedColumns: ["id"];
          }
        ];
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
        Relationships: [
          {
            foreignKeyName: "advertisement_photos_advertisement_id_fkey";
            columns: ["advertisement_id"];
            isOneToOne: false;
            referencedRelation: "advertisements";
            referencedColumns: ["id"];
          }
        ];
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
        Relationships: [
          {
            foreignKeyName: "advertisement_reviews_advertisement_id_fkey";
            columns: ["advertisement_id"];
            isOneToOne: false;
            referencedRelation: "advertisements";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "advertisement_reviews_reviewer_id_fkey";
            columns: ["reviewer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      advertisement_service_locations: {
        Row: {
          advertisement_id: string;
          location: Database["public"]["Enums"]["service_location_type"];
        };
        Insert: {
          advertisement_id: string;
          location: Database["public"]["Enums"]["service_location_type"];
        };
        Update: {
          advertisement_id?: string;
          location?: Database["public"]["Enums"]["service_location_type"];
        };
        Relationships: [
          {
            foreignKeyName: "advertisement_service_locations_advertisement_id_fkey";
            columns: ["advertisement_id"];
            isOneToOne: false;
            referencedRelation: "advertisements";
            referencedColumns: ["id"];
          }
        ];
      };
      advertisement_services: {
        Row: {
          advertisement_id: string;
          service: Database["public"]["Enums"]["service_type"];
        };
        Insert: {
          advertisement_id: string;
          service: Database["public"]["Enums"]["service_type"];
        };
        Update: {
          advertisement_id?: string;
          service?: Database["public"]["Enums"]["service_type"];
        };
        Relationships: [
          {
            foreignKeyName: "advertisement_services_advertisement_id_fkey";
            columns: ["advertisement_id"];
            isOneToOne: false;
            referencedRelation: "advertisements";
            referencedColumns: ["id"];
          }
        ];
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
        Relationships: [
          {
            foreignKeyName: "advertisement_videos_advertisement_id_fkey";
            columns: ["advertisement_id"];
            isOneToOne: false;
            referencedRelation: "advertisements";
            referencedColumns: ["id"];
          }
        ];
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
        Relationships: [
          {
            foreignKeyName: "advertisement_views_advertisement_id_fkey";
            columns: ["advertisement_id"];
            isOneToOne: false;
            referencedRelation: "advertisements";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_advertisement_views_advertisement";
            columns: ["advertisement_id"];
            isOneToOne: false;
            referencedRelation: "advertisements";
            referencedColumns: ["id"];
          }
        ];
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
        Relationships: [
          {
            foreignKeyName: "advertisement_whatsapp_clicks_advertisement_id_fkey";
            columns: ["advertisement_id"];
            isOneToOne: false;
            referencedRelation: "advertisements";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_advertisement_whatsapp_clicks_advertisement";
            columns: ["advertisement_id"];
            isOneToOne: false;
            referencedRelation: "advertisements";
            referencedColumns: ["id"];
          }
        ];
      };
      favorites: {
        Row: {
          advertisement_id: string;
          created_at: string;
          id: string;
          user_id: string;
        };
        Insert: {
          advertisement_id: string;
          created_at?: string;
          id?: string;
          user_id: string;
        };
        Update: {
          advertisement_id?: string;
          created_at?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "favorites_advertisement_id_fkey";
            columns: ["advertisement_id"];
            isOneToOne: false;
            referencedRelation: "advertisements";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          role: Database["public"]["Enums"]["user_role"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          name: string;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
        };
        Relationships: [];
      };
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'cliente' | 'anunciante' | 'admin'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
