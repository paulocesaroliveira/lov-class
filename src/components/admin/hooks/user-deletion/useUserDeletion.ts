import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { validateUserDeletion } from "./validations";
import { deleteUserProfile } from "./deleteUserProfile";
import { deleteUserRelatedData } from "./deleteUserRelatedData";

type DeleteUserParams = {
  user_id: string;
};

type DeleteUserResponse = {
  success: boolean;
  message: string;
};

export const useUserDeletion = () => {
  return useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.rpc<DeleteUserResponse>(
        'delete_user',
        { user_id: userId }
      );

      if (error) throw error;
      return data;
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
      throw error;
    }
  });
};