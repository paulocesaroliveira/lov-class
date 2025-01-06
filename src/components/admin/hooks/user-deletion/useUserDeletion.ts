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

  const deleteUserByName = async (name: string): Promise<{ success: boolean }> => {
    try {
      // First find the user by name
      const { data: profiles, error: searchError } = await supabase
        .from('profiles')
        .select('id, name')
        .ilike('name', `%${name}%`);

      if (searchError) {
        toast.error("Erro ao buscar usuário");
        return { success: false };
      }

      if (!profiles || profiles.length === 0) {
        toast.error("Usuário não encontrado");
        return { success: false };
      }

      if (profiles.length > 1) {
        toast.error("Múltiplos usuários encontrados com esse nome. Por favor, seja mais específico.");
        return { success: false };
      }

      // Delete the user
      return await deleteUser(profiles[0].id);
    } catch (error) {
      console.error("Error in deleteUserByName:", error);
      toast.error("Erro ao excluir usuário");
      return { success: false };
    }
  };

  return { deleteUser, deleteUserByName };
};