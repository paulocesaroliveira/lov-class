import { supabase } from "@/integrations/supabase/client";

const TABLES = [
  "admin_notes",
  "advertisement_comments",
  "favorites",
  "feed_posts",
  "feed_post_media",
  "role_change_history",
  "user_activity_logs",
  "user_blocks"
] as const;

type TableName = typeof TABLES[number];

export const deleteUserRelatedData = async (userId: string) => {
  try {
    for (const table of TABLES) {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("user_id", userId);

      if (error) {
        console.error(`Error deleting from ${table}:`, error);
        throw error;
      }
    }
  } catch (error) {
    console.error("Error in deleteUserRelatedData:", error);
    throw error;
  }
};