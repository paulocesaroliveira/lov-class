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
        ]
      }
      advertisement_reviews: {
        Row: {
          advertisement_id: string
          created_at: string
          id: string
          review_notes: string | null
          reviewer_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          advertisement_id: string
          created_at?: string
          id?: string
          review_notes?: string | null
          reviewer_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          advertisement_id?: string
          created_at?: string
          id?: string
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
        ]
      }
      advertisement_views: {
        Row: {
          advertisement_id: string | null
          id: string
          viewed_at: string
        }
        Insert: {
          advertisement_id?: string | null
          id?: string
          viewed_at?: string
        }
        Update: {
          advertisement_id?: string | null
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
        ]
      }
      advertisement_whatsapp_clicks: {
        Row: {
          advertisement_id: string | null
          clicked_at: string
          id: string
        }
        Insert: {
          advertisement_id?: string | null
          clicked_at?: string
          id?: string
        }
        Update: {
          advertisement_id?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_users_roles: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          user_email: string
          user_role: Database["public"]["Enums"]["user_role"]
          created_at: string
        }[]
      }
    }
    Enums: {
      ad_category: "mulher" | "trans" | "homem"
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
