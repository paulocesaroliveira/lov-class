import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { validateDeletion } from "./validations";
import { DeleteUserResponse } from "../../types/metrics";

export const useUserDeletion = () => {
  return useMutation<DeleteUserResponse, Error, string>({
    mutationFn: async (userId: string) => {
      // Validate the deletion request
      const validationResult = await validateDeletion(userId);
      if (!validationResult.success) {
        throw new Error(validationResult.message);
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
  });
};