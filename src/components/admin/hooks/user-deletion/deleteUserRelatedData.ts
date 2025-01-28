import { supabase } from "@/integrations/supabase/client";

const deleteFromTable = async (tableName: string, userId: string) => {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('profile_id', userId);

  if (error) {
    console.error(`Error deleting from ${tableName}:`, error);
    throw error;
  }
};

export const deleteUserRelatedData = async (userId: string) => {
  try {
    // Delete data from all related tables in order
    const tables = [
      "advertisements",
      "advertisement_photos",
      "advertisement_videos", 
      "advertisement_services",
      "advertisement_service_locations",
      "advertisement_reviews",
      "advertiser_documents",
      "feed_posts",
      "feed_post_media",
      "favorites",
      "user_blocks",
      "user_activity_logs",
      "role_change_history",
      "admin_notes"
    ];

    for (const table of tables) {
      await deleteFromTable(table, userId);
    }

    return true;
  } catch (error) {
    console.error("Error deleting user related data:", error);
    throw error;
  }
};