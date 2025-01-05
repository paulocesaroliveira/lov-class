import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { ChatMessagesProps } from '../types';
import { MessageList } from '../MessageList';

export const ChatMessages = ({
  messages,
  isLoading,
  error,
  userId,
  onLoadMore,
  hasMore,
  isLoadingMore
}: ChatMessagesProps) => {
  const { ref, inView } = useInView();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inView && hasMore && !isLoadingMore) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoadingMore, onLoadMore]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-muted-foreground">Carregando mensagens...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-red-500">Erro ao carregar mensagens</span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {hasMore && (
        <div ref={ref} className="p-2 text-center text-sm text-muted-foreground">
          {isLoadingMore ? 'Carregando mais mensagens...' : 'Carregue mais mensagens'}
        </div>
      )}
      <MessageList
        messages={messages}
        currentUserId={userId}
      />
      <div ref={messagesEndRef} />
    </div>
  );
};