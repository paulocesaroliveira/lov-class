import { supabase } from "@/integrations/supabase/client";

export const deleteUserRelatedData = async (userId: string) => {
  const tables = [
    'advertisement_comments',
    'advertisement_photos',
    'advertisement_videos',
    'advertisement_services',
    'advertisement_service_locations',
    'advertisement_reviews',
    'advertiser_documents',
    'advertisements',
    'favorites',
    'feed_post_media',
    'feed_posts',
    'user_blocks',
    'user_activity_logs',
    'role_change_history',
    'admin_notes'
  ];

  for (const table of tables) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error(`Error deleting from ${table}:`, error);
      throw error;
    }
  }
};