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
    messages,
    isLoading,
    error,
    hasMore,
    isLoadingMore,
    loadMore,
    sendMessage
  } = useMessages(conversationId);

  const handleSendMessage = useCallback(async (content: string) => {
    try {
      await sendMessage(content);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erro ao enviar mensagem');
    }
  }, [sendMessage]);

  return {
    messages,
    isLoading,
    error,
    hasMore,
    isLoadingMore,
    loadMore,
    handleSendMessage
  };
};