import { UserRole } from "../types";
import { useUserMutations } from "./useUserMutations";

export const useUserActions = () => {
  const { roleChangeMutation, deleteUserMutation, addNoteMutation } = useUserMutations();

  return {
    handleRoleChange: async (userId: string, newRole: UserRole) => {
      try {
        await roleChangeMutation.mutateAsync({ userId, newRole });
        return true;
      } catch {
        return false;
      }
    },
    handleDeleteUser: async (userId: string) => {
      try {
        await deleteUserMutation.mutateAsync(userId);
        return true;
      } catch {
        return false;
      }
    },
    handleAddNote: async (userId: string, note: string) => {
      try {
        return await addNoteMutation.mutateAsync({ userId, note });
      } catch {
        return false;
      }
    },
  };
};