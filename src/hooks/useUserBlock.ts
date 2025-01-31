import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BlockedUser {
  id: string;
  blocked_user_id: string;
  blocked_by_id: string;
  reason: string;
  created_at: string;
}

export const useUserBlock = (userId: string) => {
  const queryClient = useQueryClient();

  const { data: blockedUsers } = useQuery({
    queryKey: ['blocked-users', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_blocks')
        .select('*')
        .eq('blocked_by_id', userId);

      if (error) throw error;
      return data as BlockedUser[];
    }
  });

  const blockUserMutation = useMutation({
    mutationFn: async ({ blockedUserId, reason }: { blockedUserId: string, reason: string }) => {
      const { error } = await supabase
        .from('user_blocks')
        .insert({
          blocked_user_id: blockedUserId,
          blocked_by_id: userId,
          reason
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked-users'] });
      toast.success('Usuário bloqueado com sucesso');
    },
    onError: (error) => {
      console.error('Error blocking user:', error);
      toast.error('Erro ao bloquear usuário');
    }
  });

  const unblockUserMutation = useMutation({
    mutationFn: async (blockedUserId: string) => {
      const { error } = await supabase
        .from('user_blocks')
        .delete()
        .eq('blocked_user_id', blockedUserId)
        .eq('blocked_by_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked-users'] });
      toast.success('Usuário desbloqueado com sucesso');
    },
    onError: (error) => {
      console.error('Error unblocking user:', error);
      toast.error('Erro ao desbloquear usuário');
    }
  });

  return {
    blockedUsers,
    blockUser: blockUserMutation.mutate,
    unblockUser: unblockUserMutation.mutate,
    isBlocking: blockUserMutation.isPending,
    isUnblocking: unblockUserMutation.isPending
  };
};