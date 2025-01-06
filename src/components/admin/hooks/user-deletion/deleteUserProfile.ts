import { supabase } from "@/integrations/supabase/client";

export const deleteUserProfile = async (
  userId: string,
  logStep: (step: string, success: boolean, error?: string) => void
) => {
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);
  
  logStep("Delete profile", !error, error?.message);
  if (error) throw new Error(`Failed to delete profile: ${error.message}`);
};