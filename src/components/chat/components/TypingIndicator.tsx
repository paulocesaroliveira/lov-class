import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TypingIndicatorProps {
  conversationId: string;
  currentUserId: string;
}

export const TypingIndicator = ({ conversationId, currentUserId }: TypingIndicatorProps) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
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
          if (payload.new && payload.new.is_typing && payload.new.user_id !== currentUserId) {
            const { data: userData } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', payload.new.user_id)
              .single();

            if (userData) {
              setTypingUsers(prev => [...new Set([...prev, userData.name])]);
            }
          } else {
            setTypingUsers(prev => prev.filter(name => name !== payload.old?.user_id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, currentUserId]);

  if (typingUsers.length === 0) return null;

  return (
    <div className="px-4 py-2 text-sm text-white/70 italic">
      {typingUsers.join(', ')} {typingUsers.length === 1 ? 'está' : 'estão'} digitando...
    </div>
  );
};