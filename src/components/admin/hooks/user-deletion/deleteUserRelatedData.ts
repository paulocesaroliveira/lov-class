import { supabase } from "@/integrations/supabase/client";

const TABLES = [
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
] as const;

type TableName = typeof TABLES[number];

export const deleteUserRelatedData = async (userId: string) => {
  try {
    console.log("Starting deletion of user related data");

    for (const table of TABLES) {
      // Delete records where user_id matches
      const { error: userIdError } = await supabase
        .from(table)
        .delete()
        .eq('user_id', userId);

      if (userIdError) {
        console.error(`Error deleting from ${table} by user_id:`, userIdError);
      }

      // Delete records where profile_id matches
      const { error: profileIdError } = await supabase
        .from(table)
        .delete()
        .eq('profile_id', userId);

      if (profileIdError) {
        console.error(`Error deleting from ${table} by profile_id:`, profileIdError);
      }
    }

    console.log("Completed deletion of user related data");
  } catch (error) {
    console.error("Error in deleteUserRelatedData:", error);
    throw error;
  }
};