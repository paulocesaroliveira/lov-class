import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "../types";
import { toast } from "sonner";
import { useAdminRateLimit } from "./useAdminRateLimit";

export const useUserMutations = () => {
  const queryClient = useQueryClient();
  const { checkRateLimit } = useAdminRateLimit();

  const roleChangeMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: UserRole }) => {
      const canProceed = await checkRateLimit('change_user_role');
      if (!canProceed) throw new Error('Rate limit exceeded');

      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      await supabase.from("user_activity_logs").insert({
        user_id: userId,
        action_type: "role_change",
        description: `Role changed to ${newRole}`,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Papel do usuário atualizado com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao atualizar papel do usuário:", error);
      toast.error("Erro ao atualizar papel do usuário");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const canProceed = await checkRateLimit('delete_user');
      if (!canProceed) throw new Error('Rate limit exceeded');

      // First delete from auth.users which will cascade to profiles
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) throw authError;

      // Log the deletion
      await supabase.from("user_activity_logs").insert({
        user_id: userId,
        action_type: "user_deletion",
        description: "User account deleted by admin",
        created_by: (await supabase.auth.getUser()).data.user?.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Usuário excluído com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao excluir usuário:", error);
      toast.error("Erro ao excluir usuário");
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async ({ userId, note }: { userId: string; note: string }) => {
      const canProceed = await checkRateLimit('add_user_note');
      if (!canProceed) throw new Error('Rate limit exceeded');

      const { error } = await supabase.from("admin_notes").insert({
        user_id: userId,
        note,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Nota adicionada com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao adicionar nota:", error);
      toast.error("Erro ao adicionar nota");
    },
  });

  return {
    roleChangeMutation,
    deleteUserMutation,
    addNoteMutation,
  };
};