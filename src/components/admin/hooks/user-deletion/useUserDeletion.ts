import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { validateDeletion } from "./validations";
import { toast } from "sonner";

export const useUserDeletion = () => {
  const mutation = useMutation<boolean, Error, string>({
    mutationFn: async (userId: string) => {
      const validationResult = await validateDeletion(userId);
      if (!validationResult.success) {
        throw new Error(validationResult.error || "Failed to validate deletion");
      }

      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) throw error;
      return true;
    },
  });

  return {
    deleteUser: async (userId: string) => {
      try {
        await mutation.mutateAsync(userId);
        toast.success("Usuário excluído com sucesso");
        return true;
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to delete user');
        return false;
      }
    }
  };
};