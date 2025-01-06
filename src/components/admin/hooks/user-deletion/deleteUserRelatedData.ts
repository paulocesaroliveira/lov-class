import { supabase } from "@/integrations/supabase/client";
import { DeletionProgress } from "./types";

export const deleteUserRelatedData = async (
  userId: string,
  logStep: (step: string, success: boolean, error?: string) => void
) => {
  const tables = [
    { name: "favorites", column: "user_id" },
    { name: "advertisement_comments", column: "user_id" },
    { name: "admin_notes", column: "user_id" },
    { name: "user_activity_logs", column: "user_id" },
    { name: "role_change_history", column: "user_id" }
  ];

  // Delete user's advertisements and related data
  const { data: advertisements } = await supabase
    .from("advertisements")
    .select("id")
    .eq("profile_id", userId);

  if (advertisements && advertisements.length > 0) {
    for (const ad of advertisements) {
      const adRelatedTables = [
        { name: "advertisement_photos", column: "advertisement_id" },
        { name: "advertisement_videos", column: "advertisement_id" },
        { name: "advertisement_services", column: "advertisement_id" },
        { name: "advertisement_service_locations", column: "advertisement_id" },
        { name: "advertisement_views", column: "advertisement_id" },
        { name: "advertisement_whatsapp_clicks", column: "advertisement_id" },
        { name: "advertiser_documents", column: "advertisement_id" }
      ];

      for (const table of adRelatedTables) {
        const { error } = await supabase
          .from(table.name)
          .delete()
          .eq(table.column, ad.id);
        
        logStep(`Delete ${table.name}`, !error, error?.message);
        if (error) throw new Error(`Failed to delete ${table.name}: ${error.message}`);
      }
    }

    // Delete advertisements
    const { error: adsError } = await supabase
      .from("advertisements")
      .delete()
      .eq("profile_id", userId);
    
    logStep("Delete advertisements", !adsError, adsError?.message);
    if (adsError) throw new Error(`Failed to delete advertisements: ${adsError.message}`);
  }

  // Delete other related data
  for (const table of tables) {
    const { error } = await supabase
      .from(table.name)
      .delete()
      .eq(table.column, userId);
    
    logStep(`Delete ${table.name}`, !error, error?.message);
    if (error) throw new Error(`Failed to delete ${table.name}: ${error.message}`);
  }
};