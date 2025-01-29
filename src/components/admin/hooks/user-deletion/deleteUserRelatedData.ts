import { supabase } from "@/integrations/supabase/client";

const TABLES = [
  "admin_notes",
  "advertisement_comments",
  "advertisement_reviews",
  "favorites",
  "feed_posts",
  "user_activity_logs",
  "user_blocks",
] as const;

type TableName = typeof TABLES[number];

export const deleteUserRelatedData = async (
  userId: string,
  logStep: (step: string, success: boolean, error?: string) => void
) => {
  for (const table of TABLES) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq("user_id", userId);
    
    logStep(`Delete ${table}`, !error, error?.message);
    if (error) throw new Error(`Failed to delete ${table}: ${error.message}`);
  }
};