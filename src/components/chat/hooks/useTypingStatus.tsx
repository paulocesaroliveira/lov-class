import { useEffect, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TypingUser } from '@/types/chat';

export const useTypingStatus = (
  conversationId: string | undefined,
  userId: string | undefined
) => {
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<TypingUser | null>(null);

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
        }, {
          onConflict: 'conversation_id,user_id'
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
        async (payload: any) => {
          console.log('Typing status changed:', payload);
          
          if (payload.new && payload.new.user_id !== userId) {
            const { data: userData } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', payload.new.user_id)
              .single();

            if (userData) {
              setIsTyping(payload.new.is_typing);
              setTypingUser(payload.new.is_typing ? {
                id: payload.new.user_id,
                name: userData.name
              } : null);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, userId]);

  return { setTypingStatus, isTyping, typingUser };
};