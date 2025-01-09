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
          created_at: string | null
          created_by: string | null
          id: string
          note: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          note: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          note?: string
          user_id?: string | null
        }
        Relationships: []
      }
      advertisement_comments: {
        Row: {
          advertisement_id: string | null
          comment: string
          created_at: string | null
          id: string
          rating: number | null
          user_id: string | null
        }
        Insert: {
          advertisement_id?: string | null
          comment: string
          created_at?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          advertisement_id?: string | null
          comment?: string
          created_at?: string | null
          id?: string
          rating?: number | null
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
        ]
      }
      advertisement_photos: {
        Row: {
          advertisement_id: string | null
          created_at: string | null
          id: string
          photo_url: string
        }
        Insert: {
          advertisement_id?: string | null
          created_at?: string | null
          id?: string
          photo_url: string
        }
        Update: {
          advertisement_id?: string | null
          created_at?: string | null
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
          advertisement_id: string | null
          block_reason: string | null
          created_at: string
          id: string
          review_notes: string | null
          reviewer_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          advertisement_id?: string | null
          block_reason?: string | null
          created_at?: string
          id?: string
          review_notes?: string | null
          reviewer_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          advertisement_id?: string | null
          block_reason?: string | null
          created_at?: string
          id?: string
          review_notes?: string | null
          reviewer_id?: string | null
          status?: string | null
          updated_at?: string | null
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
          advertisement_id: string | null
          created_at: string | null
          id: string
          location: string
        }
        Insert: {
          advertisement_id?: string | null
          created_at?: string | null
          id?: string
          location: string
        }
        Update: {
          advertisement_id?: string | null
          created_at?: string | null
          id?: string
          location?: string
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
          advertisement_id: string | null
          created_at: string | null
          id: string
          service: string
        }
        Insert: {
          advertisement_id?: string | null
          created_at?: string | null
          id?: string
          service: string
        }
        Update: {
          advertisement_id?: string | null
          created_at?: string | null
          id?: string
          service?: string
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
          created_at: string | null
          id: string
          video_url: string
        }
        Insert: {
          advertisement_id?: string | null
          created_at?: string | null
          id?: string
          video_url: string
        }
        Update: {
          advertisement_id?: string | null
          created_at?: string | null
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
          created_at: string | null
          id: string
        }
        Insert: {
          advertisement_id?: string | null
          created_at?: string | null
          id?: string
        }
        Update: {
          advertisement_id?: string | null
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      advertisement_whatsapp_clicks: {
        Row: {
          advertisement_id: string | null
          created_at: string | null
          id: string
        }
        Insert: {
          advertisement_id?: string | null
          created_at?: string | null
          id?: string
        }
        Update: {
          advertisement_id?: string | null
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      advertisements: {
        Row: {
          block_reason: string | null
          city: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          neighborhood: string | null
          profile_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          block_reason?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          neighborhood?: string | null
          profile_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          block_reason?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          neighborhood?: string | null
          profile_id?: string | null
          status?: string | null
          updated_at?: string
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
          created_at: string | null
          document_url: string
          id: string
          verified: boolean | null
        }
        Insert: {
          advertisement_id?: string | null
          created_at?: string | null
          document_url: string
          id?: string
          verified?: boolean | null
        }
        Update: {
          advertisement_id?: string | null
          created_at?: string | null
          document_url?: string
          id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "advertiser_documents_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          advertisement_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          advertisement_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          advertisement_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      feed_post_media: {
        Row: {
          created_at: string | null
          id: string
          media_type: string
          media_url: string
          post_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          media_type: string
          media_url: string
          post_id?: string | null
        }
        Update: {
          created_at?: string | null
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
          created_at: string | null
          id: string
          profile_id: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          profile_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          profile_id?: string | null
          updated_at?: string | null
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
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      role_change_history: {
        Row: {
          changed_by: string | null
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_activity_logs: {
        Row: {
          action_type: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_blocks: {
        Row: {
          blocked_by_id: string | null
          blocked_user_id: string | null
          created_at: string | null
          description: string | null
          id: string
          reason: string | null
        }
        Insert: {
          blocked_by_id?: string | null
          blocked_user_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          reason?: string | null
        }
        Update: {
          blocked_by_id?: string | null
          blocked_user_id?: string | null
          created_at?: string | null
          description?: string | null
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
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      ad_status: "novo" | "aprovado" | "bloqueado" | "pendente"
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
