import { useState, useCallback } from 'react';
import { useMessages } from './useMessages';
import { ChatContentState } from '../types';
import { toast } from 'sonner';

export const useChat = (conversationId: string, userId: string) => {
  const [state, setState] = useState<ChatContentState>({
    isLoading: true,
    error: null,
    messages: []
  });

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useMessages(conversationId);

  // Flatten the messages from all pages
  const messages = data?.pages.flatMap(page => page.messages) ?? [];

  const handleSendMessage = useCallback(async (content: string) => {
    try {
      const { data: messageData, error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            sender_id: userId,
            content
          }
        ])
        .select('*')
        .single();

      if (error) throw error;
      return messageData;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erro ao enviar mensagem');
      throw error;
    }
  }, [conversationId, userId]);

  return {
    messages,
    isLoading,
    error,
    hasMore: hasNextPage,
    isLoadingMore: isFetchingNextPage,
    loadMore: fetchNextPage,
    handleSendMessage
  };
};