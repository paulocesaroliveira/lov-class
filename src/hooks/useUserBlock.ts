import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BlockReasonType } from '@/integrations/supabase/types/enums';
import type { UserBlocksTable } from '@/integrations/supabase/types/tables/userBlocks';

type UserBlock = UserBlocksTable['Row'];

export const useUserBlock = (userId: string) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState<string | null>(null);

  useEffect(() => {
    const checkBlockStatus = async () => {
      const { data, error } = await supabase
        .from('user_blocks')
        .select('reason, description')
        .eq('blocked_user_id', userId)
        .is('expires_at', null)
        .single();

      if (error) {
        console.error('Error checking block status:', error);
        return;
      }

      if (data) {
        setIsBlocked(true);
        setBlockReason(data.description || data.reason);
      }
    };

    checkBlockStatus();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('user_blocks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_blocks',
          filter: `blocked_user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setIsBlocked(true);
            setBlockReason(payload.new.description || payload.new.reason);
            toast.error('Você foi bloqueado e não pode mais enviar mensagens.');
          } else if (payload.eventType === 'DELETE') {
            setIsBlocked(false);
            setBlockReason(null);
            toast.success('Seu bloqueio foi removido.');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const blockUser = async (targetUserId: string, reason: BlockReasonType, description?: string) => {
    const { error } = await supabase
      .from('user_blocks')
      .insert({
        blocked_user_id: targetUserId,
        blocked_by_id: userId,
        reason,
        description,
      });

    if (error) {
      console.error('Error blocking user:', error);
      toast.error('Erro ao bloquear usuário');
      return false;
    }

    toast.success('Usuário bloqueado com sucesso');
    return true;
  };

  const unblockUser = async (targetUserId: string) => {
    const { error } = await supabase
      .from('user_blocks')
      .delete()
      .match({ blocked_user_id: targetUserId, blocked_by_id: userId });

    if (error) {
      console.error('Error unblocking user:', error);
      toast.error('Erro ao desbloquear usuário');
      return false;
    }

    toast.success('Usuário desbloqueado com sucesso');
    return true;
  };

  return {
    isBlocked,
    blockReason,
    blockUser,
    unblockUser,
  };
};