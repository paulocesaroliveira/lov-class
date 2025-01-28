import { supabase } from "@/integrations/supabase/client";

type TableName = 
  | "admin_notes"
  | "advertisement_comments"
  | "advertisement_reviews"
  | "favorites"
  | "feed_posts"
  | "user_activity_logs"
  | "user_blocks";

const TABLES: TableName[] = [
  "admin_notes",
  "advertisement_comments",
  "advertisement_reviews",
  "favorites",
  "feed_posts",
  "user_activity_logs",
  "user_blocks"
] as const;

export const deleteUserRelatedData = async (userId: string) => {
  try {
    for (const table of TABLES) {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error(`Error deleting from ${table}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in deleteUserRelatedData:', error);
    throw error;
  }
};