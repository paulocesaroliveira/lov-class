import { supabase } from "@/integrations/supabase/client";

export const deleteUserRelatedData = async (userId: string) => {
  try {
    // Delete user's advertisements and related data
    const { data: ads } = await supabase
      .from('advertisements')
      .select('id')
      .eq('profile_id', userId);

    if (ads) {
      for (const ad of ads) {
        // Delete related records first
        await Promise.all([
          supabase.from('advertisement_photos').delete().eq('advertisement_id', ad.id),
          supabase.from('advertisement_videos').delete().eq('advertisement_id', ad.id),
          supabase.from('advertisement_services').delete().eq('advertisement_id', ad.id),
          supabase.from('advertisement_service_locations').delete().eq('advertisement_id', ad.id),
          supabase.from('advertisement_reviews').delete().eq('advertisement_id', ad.id),
          supabase.from('advertisement_comments').delete().eq('advertisement_id', ad.id),
          supabase.from('advertiser_documents').delete().eq('advertisement_id', ad.id),
        ]);
      }
      
      // Then delete the advertisements
      await supabase.from('advertisements').delete().eq('profile_id', userId);
    }

    // Delete user's favorites
    await supabase.from('favorites').delete().eq('user_id', userId);

    // Delete user's feed posts and media
    const { data: posts } = await supabase
      .from('feed_posts')
      .select('id')
      .eq('profile_id', userId);

    if (posts) {
      for (const post of posts) {
        await supabase.from('feed_post_media').delete().eq('post_id', post.id);
      }
      await supabase.from('feed_posts').delete().eq('profile_id', userId);
    }

    // Delete user's activity logs
    await supabase.from('user_activity_logs').delete().eq('user_id', userId);

    // Delete user's blocks
    await supabase.from('user_blocks').delete().eq('blocked_by_id', userId);
    await supabase.from('user_blocks').delete().eq('blocked_user_id', userId);

    // Delete user's role change history
    await supabase.from('role_change_history').delete().eq('user_id', userId);

    // Finally delete the profile
    await supabase.from('profiles').delete().eq('id', userId);

    return { success: true };
  } catch (error) {
    console.error('Error deleting user related data:', error);
    return { success: false, error };
  }
};