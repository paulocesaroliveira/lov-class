import { ServiceType, ServiceLocationType, AdCategory, UserRole } from './enums';

export interface Database {
  public: {
    Tables: {
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
      advertisements: {
        Row: {
          birth_date: string;
          block_reason: string | null;
          blocked: boolean | null;
          body_type: string;
          category: Database["public"]["Enums"]["ad_category"];
          city: string;
          created_at: string;
          custom_rate_description: string | null;
          custom_rate_value: number | null;
          description: string;
          ethnicity: string;
          hair_color: string;
          height: number;
          hourly_rate: number;
          id: string;
          name: string;
          neighborhood: string;
          profile_id: string;
          profile_photo_url: string | null;
          silicone: string;
          state: string;
          style: string;
          updated_at: string;
          weight: number;
          whatsapp: string;
        };
        Insert: {
          birth_date: string;
          block_reason?: string | null;
          blocked?: boolean | null;
          body_type?: string;
          category: Database["public"]["Enums"]["ad_category"];
          city: string;
          created_at?: string;
          custom_rate_description?: string | null;
          custom_rate_value?: number | null;
          description: string;
          ethnicity?: string;
          hair_color?: string;
          height: number;
          hourly_rate: number;
          id?: string;
          name: string;
          neighborhood: string;
          profile_id: string;
          profile_photo_url?: string | null;
          silicone?: string;
          state: string;
          style: string;
          updated_at?: string;
          weight: number;
          whatsapp: string;
        };
        Update: {
          birth_date?: string;
          block_reason?: string | null;
          blocked?: boolean | null;
          body_type?: string;
          category?: Database["public"]["Enums"]["ad_category"];
          city?: string;
          created_at?: string;
          custom_rate_description?: string | null;
          custom_rate_value?: number | null;
          description?: string;
          ethnicity?: string;
          hair_color?: string;
          height?: number;
          hourly_rate?: number;
          id?: string;
          name?: string;
          neighborhood?: string;
          profile_id?: string;
          profile_photo_url?: string | null;
          silicone?: string;
          state?: string;
          style?: string;
          updated_at?: string;
          weight?: number;
          whatsapp?: string;
        };
        Relationships: [
          {
            foreignKeyName: "advertisements_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      advertiser_documents: {
        Row: {
          advertisement_id: string;
          created_at: string;
          document_url: string;
          id: string;
          verified: boolean | null;
        };
        Insert: {
          advertisement_id: string;
          created_at?: string;
          document_url: string;
          id?: string;
          verified?: boolean | null;
        };
        Update: {
          advertisement_id?: string;
          created_at?: string;
          document_url?: string;
          id?: string;
          verified?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "advertiser_documents_advertisement_id_fkey";
            columns: ["advertisement_id"];
            isOneToOne: true;
            referencedRelation: "advertisements";
            referencedColumns: ["id"];
          }
        ];
      };
      conversation_participants: {
        Row: {
          advertisement_id: string | null;
          conversation_id: string;
          created_at: string;
          user_id: string;
        };
        Insert: {
          advertisement_id?: string | null;
          conversation_id: string;
          created_at?: string;
          user_id: string;
        };
        Update: {
          advertisement_id?: string | null;
          conversation_id?: string;
          created_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conversation_participants_advertisement_id_fkey";
            columns: ["advertisement_id"];
            isOneToOne: false;
            referencedRelation: "advertisements";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          }
        ];
      };
      conversations: {
        Row: {
          created_at: string;
          id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
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
      feed_post_media: {
        Row: {
          created_at: string;
          id: string;
          media_type: string;
          media_url: string;
          post_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          media_type: string;
          media_url: string;
          post_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          media_type?: string;
          media_url?: string;
          post_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "feed_post_media_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "feed_posts";
            referencedColumns: ["id"];
          }
        ];
      };
      feed_posts: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          profile_id: string;
          updated_at: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          profile_id: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          profile_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "feed_posts_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      messages: {
        Row: {
          content: string;
          conversation_id: string;
          created_at: string;
          id: string;
          read_at: string | null;
          sender_id: string;
        };
        Insert: {
          content: string;
          conversation_id: string;
          created_at?: string;
          id?: string;
          read_at?: string | null;
          sender_id: string;
        };
        Update: {
          content?: string;
          conversation_id?: string;
          created_at?: string;
          id?: string;
          read_at?: string | null;
          sender_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
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
      user_typing_status: {
        Row: {
          conversation_id: string;
          user_id: string;
          is_typing: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          conversation_id: string;
          user_id: string;
          is_typing?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          conversation_id?: string;
          user_id?: string;
          is_typing?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_typing_status_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Enums: {
      service_type: ServiceType;
      service_location_type: ServiceLocationType;
      ad_category: AdCategory;
      user_role: UserRole;
    };
  };
}
