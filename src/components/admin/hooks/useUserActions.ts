import { UserRole } from "../types";
import { useUserMutations } from "./useUserMutations";
import { useUserDeletion } from "./user-deletion/useUserDeletion";

export const useUserActions = () => {
  const mutations = useUserMutations();
  const { deleteUser } = useUserDeletion();

  return {
    handleRoleChange: mutations.handleRoleChange,
    handleDeleteUser: deleteUser,
    handleAddNote: mutations.handleAddNote,
  };
};