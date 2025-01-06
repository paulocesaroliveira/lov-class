import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateDeletion } from "./validations";

export const useUserDeletion = () => {
  const deleteUser = async (userId: string): Promise<{ success: boolean }> => {
    try {
      // Validate if we can delete the user
      const validationResult = await validateDeletion(userId);
      if (!validationResult.success) {
        toast.error(validationResult.error || "Erro na validação");
        return { success: false };
      }

      // Call the database function to delete user and related data
      const { data, error } = await supabase.rpc('delete_user_and_related_data', {
        user_id: userId
      });

      if (error) {
        console.error("Error deleting user:", error);
        toast.error("Erro ao excluir usuário");
        return { success: false };
      }

      toast.success("Usuário excluído com sucesso");
      return { success: true };
    } catch (error) {
      console.error("Error in deleteUser:", error);
      toast.error("Erro ao excluir usuário");
      return { success: false };
    }
  };

  return { deleteUser };
};