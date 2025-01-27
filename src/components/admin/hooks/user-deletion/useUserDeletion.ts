import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { validateDeletion } from "./validations";
import { DeleteUserResponse } from "../../types/metrics";
import { toast } from "sonner";

export const useUserDeletion = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation<DeleteUserResponse, Error, string>({
    mutationFn: async (userId: string) => {
      const validationResult = await validateDeletion(userId);
      if (!validationResult.success) {
        throw new Error(validationResult.error || "Failed to validate deletion");
      }

      const { data, error } = await supabase.rpc<DeleteUserResponse>(
        'delete_user',
        { user_id: userId }
      );

      if (error) throw error;
      if (!data) {
        throw new Error('Failed to delete user');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
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
    },
    deleteUserByName: async (name: string) => {
      try {
        const { data: user } = await supabase
          .from('profiles')
          .select('id')
          .eq('name', name)
          .single();

        if (!user) {
          toast.error(`User ${name} not found`);
          return false;
        }

        return await mutation.mutateAsync(user.id).then(() => true).catch(() => false);
      } catch (error) {
        console.error('Error deleting user by name:', error);
        toast.error('Failed to delete user by name');
        return false;
      }
    }
  };
};