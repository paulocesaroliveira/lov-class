import { useState, useCallback } from 'react';
import { useMessages } from './useMessages';
import { ChatContentState } from '../types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/chat';
import { useUserBlock } from '@/hooks/useUserBlock';

export const useChat = (conversationId: string, userId: string) => {
  const [state, setState] = useState<ChatContentState>({
    isLoading: true,
    error: null,
    messages: []
  });

  const { isBlocked } = useUserBlock(userId);

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch
  } = useMessages(conversationId);

  // Flatten the messages from all pages and ensure proper typing
  const messages = data?.pages.flatMap(page => page.messages) ?? [];

  const handleSendMessage = useCallback(async (content: string): Promise<void> => {
    try {
      if (isBlocked) {
        toast.error('Você foi bloqueado e não pode enviar mensagens.');
        return;
      }

      const trimmedContent = content.trim();
      
      if (trimmedContent.length === 0) {
        toast.error('A mensagem não pode estar vazia');
        return;
      }

      if (trimmedContent.length > 1000) {
        toast.error('A mensagem é muito longa (máximo 1000 caracteres)');
        return;
      }

      const { error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            sender_id: userId,
            content: trimmedContent
          }
        ])
        .select('*')
        .single();

      if (error) {
        console.error('Error details:', error);
        
        if (error.message?.includes('Rate limit exceeded')) {
          if (error.message.includes('per minute')) {
            toast.error('Você está enviando mensagens muito rápido. Aguarde um minuto.');
          } else if (error.message.includes('per hour')) {
            toast.error('Você atingiu o limite de mensagens por hora. Tente novamente mais tarde.');
          } else if (error.message.includes('per day')) {
            toast.error('Você atingiu o limite diário de mensagens. Tente novamente amanhã.');
          }
        } else if (error.message?.includes('inappropriate content')) {
          toast.error('Sua mensagem contém conteúdo inapropriado.');
        } else if (error.message?.includes('spam patterns')) {
          toast.error('Sua mensagem foi identificada como spam.');
        } else if (error.message?.includes('length must be between')) {
          toast.error('O tamanho da mensagem deve estar entre 1 e 1000 caracteres.');
        } else {
          toast.error('Erro ao enviar mensagem. Tente novamente.');
        }
        throw error;
      }

      // Atualiza a lista de mensagens após enviar uma nova
      refetch();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [conversationId, userId, isBlocked, refetch]);

  return {
    messages,
    isLoading,
    error,
    hasMore: hasNextPage,
    isLoadingMore: isFetchingNextPage,
    loadMore: fetchNextPage,
    handleSendMessage,
    isBlocked
  };
};