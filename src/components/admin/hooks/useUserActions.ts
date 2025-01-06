import { UserRole } from "../types";
import { useUserMutations } from "./useUserMutations";

export const useUserActions = () => {
  const mutations = useUserMutations();

  return {
    handleRoleChange: mutations.handleRoleChange,
    handleDeleteUser: mutations.handleDeleteUser,
    handleAddNote: mutations.handleAddNote,
  };
};