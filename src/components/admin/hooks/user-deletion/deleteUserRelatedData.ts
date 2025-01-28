import { supabase } from "@/integrations/supabase/client";

const TABLES = [
  'admin_notes',
  'advertisement_comments',
  'advertisement_photos',
  'advertisement_reviews',
  'advertisement_service_locations',
  'advertisement_services',
  'advertisement_videos',
  'advertisement_views',
  'advertisement_whatsapp_clicks',
  'advertisements',
  'advertiser_documents',
  'favorites',
  'feed_post_media',
  'feed_posts',
  'profiles',
  'role_change_history',
  'user_activity_logs',
  'user_blocks'
] as const;

type TableName = (typeof TABLES)[number];

export const deleteUserRelatedData = async (userId: string) => {
  for (const tableName of TABLES) {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('profile_id', userId);

    if (error) {
      console.error(`Error deleting from ${tableName}:`, error);
    }
  }
};