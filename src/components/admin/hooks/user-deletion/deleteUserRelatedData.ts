import { supabase } from "@/integrations/supabase/client";

const tables = [
  "advertisement_comments",
  "advertisement_photos",
  "advertisement_videos",
  "advertisement_services",
  "advertisement_service_locations",
  "advertisement_reviews",
  "advertiser_documents",
  "advertisement_views",
  "advertisement_whatsapp_clicks",
  "favorites",
  "feed_post_media",
  "feed_posts",
  "user_blocks",
  "user_activity_logs",
  "role_change_history",
  "admin_notes"
] as const;

type TableName = typeof tables[number];

export const deleteUserRelatedData = async (userId: string) => {
  for (const table of tables) {
    await supabase.from(table).delete().eq('user_id', userId);
  }
};