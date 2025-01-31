export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_notes: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          note: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          note: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      advertisement_comments: {
        Row: {
          advertisement_id: string | null
          comment: string
          created_at: string
          id: string
          rating: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          advertisement_id?: string | null
          comment: string
          created_at?: string
          id?: string
          rating?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          advertisement_id?: string | null
          comment?: string
          created_at?: string
          id?: string
          rating?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advertisement_comments_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertisement_comments_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "mv_approved_advertisements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertisement_comments_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "pending_review_ads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertisement_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      advertisement_photos: {
        Row: {
          advertisement_id: string | null
          created_at: string
          id: string
          photo_url: string
        }
        Insert: {
          advertisement_id?: string | null
          created_at?: string
          id?: string
          photo_url: string
        }
        Update: {
          advertisement_id?: string | null
          created_at?: string
          id?: string
          photo_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "advertisement_photos_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertisement_photos_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "mv_approved_advertisements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertisement_photos_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "pending_review_ads"
            referencedColumns: ["id"]
          },
        ]
      }
      advertisement_reviews: {
        Row: {
          advertisement_id: string
          block_reason: string | null
          created_at: string
          id: string
          moderation_status: Database["public"]["Enums"]["moderation_status"]
          review_notes: string | null
          reviewer_id: string | null
          updated_at: string
        }
        Insert: {
          advertisement_id: string
          block_reason?: string | null
          created_at?: string
          id?: string
          moderation_status: Database["public"]["Enums"]["moderation_status"]
          review_notes?: string | null
          reviewer_id?: string | null
          updated_at?: string
        }
        Update: {
          advertisement_id?: string
          block_reason?: string | null
          created_at?: string
          id?: string
          moderation_status?: Database["public"]["Enums"]["moderation_status"]
          review_notes?: string | null
          reviewer_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "advertisement_reviews_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertisement_reviews_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "mv_approved_advertisements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertisement_reviews_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "pending_review_ads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertisement_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      advertisement_service_locations: {
        Row: {
          advertisement_id: string
          location: Database["public"]["Enums"]["service_location_type"]
        }
        Insert: {
          advertisement_id: string
          location: Database["public"]["Enums"]["service_location_type"]
        }
        Update: {
          advertisement_id?: string
          location?: Database["public"]["Enums"]["service_location_type"]
        }
        Relationships: [
          {
            foreignKeyName: "advertisement_service_locations_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertisement_service_locations_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "mv_approved_advertisements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertisement_service_locations_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "pending_review_ads"
            referencedColumns: ["id"]
          },
        ]
      }
      advertisement_services: {
        Row: {
          advertisement_id: string
          service: Database["public"]["Enums"]["service_type"]
        }
        Insert: {
          advertisement_id: string
          service: Database["public"]["Enums"]["service_type"]
        }
        Update: {
          advertisement_id?: string
          service?: Database["public"]["Enums"]["service_type"]
        }
        Relationships: [
          {
            foreignKeyName: "advertisement_services_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertisement_services_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "mv_approved_advertisements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertisement_services_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "pending_review_ads"
            referencedColumns: ["id"]
          },
        ]
      }
      advertisement_videos: {
        Row: {
          advertisement_id: string | null
          created_at: string
          id: string
          video_url: string
        }
        Insert: {
          advertisement_id?: string | null
          created_at?: string
          id?: string
          video_url: string
        }
        Update: {
          advertisement_id?: string | null
          created_at?: string
          id?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "advertisement_videos_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertisement_videos_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "mv_approved_advertisements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertisement_videos_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "pending_review_ads"
            referencedColumns: ["id"]
          },
        ]
      }
      advertisement_views: {
        Row: {
          advertisement_id: string | null
          created_at: string
          id: string
        }
        Insert: {
          advertisement_id?: string | null
          created_at?: string
          id?: string
        }
        Update: {
          advertisement_id?: string | null
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advertisement_views_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertisement_views_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "mv_approved_advertisements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertisement_views_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "pending_review_ads"
            referencedColumns: ["id"]
          },
        ]
      }
      advertisement_whatsapp_clicks: {
        Row: {
          advertisement_id: string | null
          created_at: string
          id: string
        }
        Insert: {
          advertisement_id?: string | null
          created_at?: string
          id?: string
        }
        Update: {
          advertisement_id?: string | null
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advertisement_whatsapp_clicks_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertisement_whatsapp_clicks_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "mv_approved_advertisements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertisement_whatsapp_clicks_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "pending_review_ads"
            referencedColumns: ["id"]
          },
        ]
      }
      advertisements: {
        Row: {
          birth_date: string
          block_reason: string | null
          blocked: boolean | null
          body_type: string
          category: Database["public"]["Enums"]["ad_category"]
          city: string
          contact_phone: string
          contact_telegram: boolean | null
          contact_whatsapp: boolean | null
          created_at: string
          custom_rate_description: string | null
          custom_rate_value: number | null
          description: string
          ethnicity: string
          hair_color: string
          height: number
          hourly_rate: number
          id: string
          moderation_status:
            | Database["public"]["Enums"]["moderation_status"]
            | null
          name: string
          neighborhood: string
          profile_id: string
          profile_photo_url: string | null
          silicone: string
          state: string
          style: string
          updated_at: string
          weight: number
        }
        Insert: {
          birth_date: string
          block_reason?: string | null
          blocked?: boolean | null
          body_type: string
          category: Database["public"]["Enums"]["ad_category"]
          city: string
          contact_phone: string
          contact_telegram?: boolean | null
          contact_whatsapp?: boolean | null
          created_at?: string
          custom_rate_description?: string | null
          custom_rate_value?: number | null
          description: string
          ethnicity: string
          hair_color: string
          height: number
          hourly_rate: number
          id?: string
          moderation_status?:
            | Database["public"]["Enums"]["moderation_status"]
            | null
          name: string
          neighborhood: string
          profile_id: string
          profile_photo_url?: string | null
          silicone: string
          state: string
          style: string
          updated_at?: string
          weight: number
        }
        Update: {
          birth_date?: string
          block_reason?: string | null
          blocked?: boolean | null
          body_type?: string
          category?: Database["public"]["Enums"]["ad_category"]
          city?: string
          contact_phone?: string
          contact_telegram?: boolean | null
          contact_whatsapp?: boolean | null
          created_at?: string
          custom_rate_description?: string | null
          custom_rate_value?: number | null
          description?: string
          ethnicity?: string
          hair_color?: string
          height?: number
          hourly_rate?: number
          id?: string
          moderation_status?:
            | Database["public"]["Enums"]["moderation_status"]
            | null
          name?: string
          neighborhood?: string
          profile_id?: string
          profile_photo_url?: string | null
          silicone?: string
          state?: string
          style?: string
          updated_at?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "advertisements_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      advertiser_documents: {
        Row: {
          advertisement_id: string | null
          created_at: string
          document_url: string
          id: string
          verified: boolean | null
        }
        Insert: {
          advertisement_id?: string | null
          created_at?: string
          document_url: string
          id?: string
          verified?: boolean | null
        }
        Update: {
          advertisement_id?: string | null
          created_at?: string
          document_url?: string
          id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "advertiser_documents_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: true
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertiser_documents_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: true
            referencedRelation: "mv_approved_advertisements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertiser_documents_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: true
            referencedRelation: "pending_review_ads"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          advertisement_id: string | null
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          advertisement_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          advertisement_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "mv_approved_advertisements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "pending_review_ads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_post_media: {
        Row: {
          created_at: string
          id: string
          media_type: string
          media_url: string
          post_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          media_type: string
          media_url: string
          post_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          media_type?: string
          media_url?: string
          post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feed_post_media_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_posts: {
        Row: {
          content: string
          created_at: string
          id: string
          profile_id: string | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          profile_id?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          profile_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_posts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Relationships: []
      }
      role_change_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          new_role: Database["public"]["Enums"]["user_role"]
          old_role: Database["public"]["Enums"]["user_role"]
          reason: string | null
          user_id: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_role: Database["public"]["Enums"]["user_role"]
          old_role: Database["public"]["Enums"]["user_role"]
          reason?: string | null
          user_id?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_role?: Database["public"]["Enums"]["user_role"]
          old_role?: Database["public"]["Enums"]["user_role"]
          reason?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_change_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_change_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_logs: {
        Row: {
          action_type: string
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_blocks: {
        Row: {
          blocked_by_id: string | null
          blocked_user_id: string | null
          created_at: string
          id: string
          reason: string | null
        }
        Insert: {
          blocked_by_id?: string | null
          blocked_user_id?: string | null
          created_at?: string
          id?: string
          reason?: string | null
        }
        Update: {
          blocked_by_id?: string | null
          blocked_user_id?: string | null
          created_at?: string
          id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_blocks_blocked_by_id_fkey"
            columns: ["blocked_by_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_blocks_blocked_user_id_fkey"
            columns: ["blocked_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      mv_approved_advertisements: {
        Row: {
          birth_date: string | null
          block_reason: string | null
          blocked: boolean | null
          body_type: string | null
          category: Database["public"]["Enums"]["ad_category"] | null
          city: string | null
          contact_phone: string | null
          contact_telegram: boolean | null
          contact_whatsapp: boolean | null
          created_at: string | null
          custom_rate_description: string | null
          custom_rate_value: number | null
          description: string | null
          ethnicity: string | null
          hair_color: string | null
          height: number | null
          hourly_rate: number | null
          id: string | null
          moderation_status:
            | Database["public"]["Enums"]["moderation_status"]
            | null
          name: string | null
          neighborhood: string | null
          photos: Json | null
          profile_id: string | null
          profile_photo_url: string | null
          silicone: string | null
          state: string | null
          style: string | null
          updated_at: string | null
          videos: Json | null
          weight: number | null
        }
        Relationships: [
          {
            foreignKeyName: "advertisements_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_review_ads: {
        Row: {
          advertiser_name: string | null
          advertiser_role: Database["public"]["Enums"]["user_role"] | null
          birth_date: string | null
          block_reason: string | null
          blocked: boolean | null
          body_type: string | null
          category: Database["public"]["Enums"]["ad_category"] | null
          city: string | null
          contact_phone: string | null
          contact_telegram: boolean | null
          contact_whatsapp: boolean | null
          created_at: string | null
          custom_rate_description: string | null
          custom_rate_value: number | null
          description: string | null
          ethnicity: string | null
          hair_color: string | null
          height: number | null
          hourly_rate: number | null
          id: string | null
          moderation_status:
            | Database["public"]["Enums"]["moderation_status"]
            | null
          name: string | null
          neighborhood: string | null
          profile_id: string | null
          profile_photo_url: string | null
          review_count: number | null
          silicone: string | null
          state: string | null
          style: string | null
          updated_at: string | null
          weight: number | null
        }
        Relationships: [
          {
            foreignKeyName: "advertisements_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      create_enum_if_not_exists: {
        Args: {
          enum_name: string
          enum_values: string[]
        }
        Returns: undefined
      }
      get_engagement_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          date: string
          unique_views: number
          total_views: number
          whatsapp_clicks: number
        }[]
      }
      get_regional_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          city: string
          view_count: number
          click_count: number
          active_ads: number
        }[]
      }
    }
    Enums: {
      ad_category: "mulher" | "trans" | "homem"
      ad_status: "pending" | "approved" | "blocked"
      moderation_status: "pending_review" | "approved" | "rejected" | "blocked"
      service_location_type:
        | "com_local"
        | "motel"
        | "clube_swing"
        | "domicilio"
        | "viagens"
      service_type:
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
        | "gangbang"
      user_role: "cliente" | "anunciante" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
