import { supabase } from "@/integrations/supabase/client";

// Define a literal union type for table names
type TableName = 
  | "admin_notes"
  | "advertisement_comments"
  | "advertisement_photos"
  | "advertisement_reviews"
  | "advertisement_service_locations"
  | "advertisement_services"
  | "advertisement_videos"
  | "advertisement_views"
  | "advertisement_whatsapp_clicks"
  | "advertisements"
  | "advertiser_documents"
  | "favorites"
  | "feed_post_media"
  | "feed_posts"
  | "profiles"
  | "role_change_history"
  | "user_activity_logs"
  | "user_blocks";

// Define the tables array with the explicit type
const TABLES: TableName[] = [
  "admin_notes",
  "advertisement_comments",
  "advertisement_photos",
  "advertisement_reviews",
  "advertisement_service_locations",
  "advertisement_services",
  "advertisement_videos",
  "advertisement_views",
  "advertisement_whatsapp_clicks",
  "advertisements",
  "advertiser_documents",
  "favorites",
  "feed_post_media",
  "feed_posts",
  "profiles",
  "role_change_history",
  "user_activity_logs",
  "user_blocks"
];

export const deleteUserRelatedData = async (userId: string) => {
  try {
    for (const table of TABLES) {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("user_id", userId);

      if (error) {
        console.error(`Error deleting from ${table}:`, error);
      }
    }
    return true;
  } catch (error) {
    console.error("Error in deleteUserRelatedData:", error);
    return false;
  }
};