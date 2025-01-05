import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTypingStatus = (
  conversationId: string | undefined,
  userId: string | undefined
) => {
  const setTypingStatus = useCallback(async (isTyping: boolean) => {
    if (!conversationId || !userId) return;

    try {
      const { error } = await supabase
        .from('user_typing_status')
        .upsert({
          conversation_id: conversationId,
          user_id: userId,
          is_typing: isTyping,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  }, [conversationId, userId]);

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`typing:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_typing_status',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          console.log('Typing status changed:', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  return { setTypingStatus };
};