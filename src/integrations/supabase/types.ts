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
      admin_action_rate_limits: {
        Row: {
          action_type: string
          admin_id: string | null
          count: number | null
          created_at: string | null
          id: string
          last_action: string | null
          updated_at: string | null
        }
        Insert: {
          action_type: string
          admin_id?: string | null
          count?: number | null
          created_at?: string | null
          id?: string
          last_action?: string | null
          updated_at?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string | null
          count?: number | null
          created_at?: string | null
          id?: string
          last_action?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_notes: {
        Row: {
          created_at: string
          created_by: string
          id: string
          metadata: Json | null
          note: string
          note_type: string | null
          severity: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          metadata?: Json | null
          note: string
          note_type?: string | null
          severity?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          metadata?: Json | null
          note?: string
          note_type?: string | null
          severity?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      advertisement_comments: {
        Row: {
          advertisement_id: string
          comment: string
          created_at: string
          id: string
          rating: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          advertisement_id: string
          comment: string
          created_at?: string
          id?: string
          rating?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          advertisement_id?: string
          comment?: string
          created_at?: string
          id?: string
          rating?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advertisement_comments_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
        ]
      }
      advertisement_photos: {
        Row: {
          advertisement_id: string
          created_at: string
          id: string
          photo_url: string
        }
        Insert: {
          advertisement_id: string
          created_at?: string
          id?: string
          photo_url: string
        }
        Update: {
          advertisement_id?: string
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
        ]
      }
      advertisement_reviews: {
        Row: {
          advertisement_id: string
          created_at: string
          id: string
          moderation_message: string | null
          review_notes: string | null
          reviewer_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          advertisement_id: string
          created_at?: string
          id?: string
          moderation_message?: string | null
          review_notes?: string | null
          reviewer_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          advertisement_id?: string
          created_at?: string
          id?: string
          moderation_message?: string | null
          review_notes?: string | null
          reviewer_id?: string | null
          status?: string
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
        ]
      }
      advertisement_videos: {
        Row: {
          advertisement_id: string
          created_at: string
          id: string
          video_url: string
        }
        Insert: {
          advertisement_id: string
          created_at?: string
          id?: string
          video_url: string
        }
        Update: {
          advertisement_id?: string
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
        ]
      }
      advertisement_views: {
        Row: {
          advertisement_id: string
          id: string
          viewed_at: string
        }
        Insert: {
          advertisement_id: string
          id?: string
          viewed_at?: string
        }
        Update: {
          advertisement_id?: string
          id?: string
          viewed_at?: string
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
            foreignKeyName: "fk_advertisement_views_advertisement"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
        ]
      }
      advertisement_whatsapp_clicks: {
        Row: {
          advertisement_id: string
          clicked_at: string
          id: string
        }
        Insert: {
          advertisement_id: string
          clicked_at?: string
          id?: string
        }
        Update: {
          advertisement_id?: string
          clicked_at?: string
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
            foreignKeyName: "fk_advertisement_whatsapp_clicks_advertisement"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
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
          created_at: string
          custom_rate_description: string | null
          custom_rate_value: number | null
          description: string
          ethnicity: string
          hair_color: string
          height: number
          hourly_rate: number
          id: string
          name: string
          neighborhood: string
          profile_id: string
          profile_photo_url: string | null
          silicone: string
          state: string
          style: string
          updated_at: string
          weight: number
          whatsapp: string
        }
        Insert: {
          birth_date: string
          block_reason?: string | null
          blocked?: boolean | null
          body_type?: string
          category: Database["public"]["Enums"]["ad_category"]
          city: string
          created_at?: string
          custom_rate_description?: string | null
          custom_rate_value?: number | null
          description: string
          ethnicity?: string
          hair_color?: string
          height: number
          hourly_rate: number
          id?: string
          name: string
          neighborhood: string
          profile_id: string
          profile_photo_url?: string | null
          silicone?: string
          state: string
          style: string
          updated_at?: string
          weight: number
          whatsapp: string
        }
        Update: {
          birth_date?: string
          block_reason?: string | null
          blocked?: boolean | null
          body_type?: string
          category?: Database["public"]["Enums"]["ad_category"]
          city?: string
          created_at?: string
          custom_rate_description?: string | null
          custom_rate_value?: number | null
          description?: string
          ethnicity?: string
          hair_color?: string
          height?: number
          hourly_rate?: number
          id?: string
          name?: string
          neighborhood?: string
          profile_id?: string
          profile_photo_url?: string | null
          silicone?: string
          state?: string
          style?: string
          updated_at?: string
          weight?: number
          whatsapp?: string
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
          advertisement_id: string
          created_at: string
          document_url: string
          id: string
          verified: boolean | null
        }
        Insert: {
          advertisement_id: string
          created_at?: string
          document_url: string
          id?: string
          verified?: boolean | null
        }
        Update: {
          advertisement_id?: string
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
        ]
      }
      favorites: {
        Row: {
          advertisement_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          advertisement_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          advertisement_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
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
          post_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          media_type: string
          media_url: string
          post_id: string
        }
        Update: {
          created_at?: string
          id?: string
          media_type?: string
          media_url?: string
          post_id?: string
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
          profile_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          profile_id?: string
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
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      role_change_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          new_role: Database["public"]["Enums"]["user_role"] | null
          old_role: Database["public"]["Enums"]["user_role"] | null
          reason: string | null
          user_id: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_role?: Database["public"]["Enums"]["user_role"] | null
          old_role?: Database["public"]["Enums"]["user_role"] | null
          reason?: string | null
          user_id?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_role?: Database["public"]["Enums"]["user_role"] | null
          old_role?: Database["public"]["Enums"]["user_role"] | null
          reason?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_activity_logs: {
        Row: {
          action_type: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          metadata: Json | null
          severity: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          severity?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          severity?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_blocks: {
        Row: {
          blocked_by_id: string | null
          blocked_user_id: string | null
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          reason: Database["public"]["Enums"]["block_reason_type"]
          updated_at: string | null
        }
        Insert: {
          blocked_by_id?: string | null
          blocked_user_id?: string | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          reason: Database["public"]["Enums"]["block_reason_type"]
          updated_at?: string | null
        }
        Update: {
          blocked_by_id?: string | null
          blocked_user_id?: string | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          reason?: Database["public"]["Enums"]["block_reason_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      advertisement_engagement_metrics: {
        Row: {
          date: string | null
          total_views: number | null
          unique_views: number | null
          whatsapp_clicks: number | null
        }
        Relationships: []
      }
      advertisement_review_counts: {
        Row: {
          count: number | null
          status: string | null
        }
        Relationships: []
      }
      regional_activity_metrics: {
        Row: {
          active_ads: number | null
          city: string | null
          click_count: number | null
          state: string | null
          view_count: number | null
        }
        Relationships: []
      }
      user_metrics: {
        Row: {
          active_users_7d: number | null
          new_users_30d: number | null
          role: Database["public"]["Enums"]["user_role"] | null
          total_users: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_admin_rate_limit: {
        Args: {
          p_admin_id: string
          p_action_type: string
          p_max_actions?: number
          p_time_window?: unknown
        }
        Returns: boolean
      }
      check_users_roles: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          user_email: string
          user_role: Database["public"]["Enums"]["user_role"]
          created_at: string
        }[]
      }
      find_or_create_conversation: {
        Args: {
          current_user_id: string
          other_user_id: string
        }
        Returns: {
          conversation_id: string
        }[]
      }
      get_messages_with_sender_names: {
        Args: {
          p_conversation_id: string
        }
        Returns: {
          id: string
          content: string
          sender_id: string
          created_at: string
          conversation_id: string
          read_at: string
          sender_name: string
        }[]
      }
      get_user_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          role: Database["public"]["Enums"]["user_role"]
          total_users: number
          new_users_30d: number
          active_users_7d: number
        }[]
      }
    }
    Enums: {
      ad_category: "mulher" | "trans" | "homem"
      block_reason_type:
        | "spam"
        | "inappropriate_content"
        | "harassment"
        | "other"
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
      user_role: "user" | "admin" | "advertiser"
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
