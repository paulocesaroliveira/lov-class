import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { validateDeletion } from "./validations";
import { toast } from "sonner";

interface DeleteUserResponse {
  success: boolean;
  message: string;
}

export const useUserDeletion = () => {
  const mutation = useMutation<DeleteUserResponse, Error, string>({
    mutationFn: async (userId: string) => {
      const validation = await validateDeletion(userId);
      if (!validation.success) {
        throw new Error(validation.error);
      }

      const { data, error } = await supabase.rpc<DeleteUserResponse, { user_id: string }>(
        'delete_user',
        { user_id: userId }
      );

      if (error) throw error;
      return data || { success: false, message: "Unknown error occurred" };
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("User deleted successfully");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const deleteUser = async (userId: string) => {
    try {
      const result = await mutation.mutateAsync(userId);
      return result.success;
    } catch {
      return false;
    }
  };

  const deleteUserByName = async (name: string) => {
    try {
      const { data: user } = await supabase
        .from('profiles')
        .select('id')
        .eq('name', name)
        .single();

      if (!user) {
        toast.error("User not found");
        return false;
      }

      return deleteUser(user.id);
    } catch (error) {
      console.error("Error deleting user by name:", error);
      return false;
    }
  };

  return { deleteUser, deleteUserByName };
};