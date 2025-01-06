import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type TableName = 
  | "favorites"
  | "advertisement_comments"
  | "admin_notes"
  | "user_activity_logs"
  | "role_change_history"
  | "profiles";

const TABLES_TO_DELETE_FROM: TableName[] = [
  "favorites",
  "advertisement_comments",
  "admin_notes",
  "user_activity_logs",
  "role_change_history",
  "profiles"
];

export const deleteUserRelatedData = async (userId: string): Promise<boolean> => {
  try {
    for (const table of TABLES_TO_DELETE_FROM) {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error(`Error deleting from ${table}:`, error);
        toast.error(`Erro ao deletar dados de ${table}`);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteUserRelatedData:", error);
    return false;
  }
};