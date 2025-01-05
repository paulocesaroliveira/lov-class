import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatHeader } from "../ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { NotificationButton } from "../NotificationButton";
import { TypingIndicator } from "./TypingIndicator";
import { useChat } from "../hooks/useChat";

interface ChatContentProps {
  conversationData: {
    advertisements?: {
      name: string;
    };
  };
  userId: string;
  conversationId: string;
}

export const ChatContent = ({ 
  conversationData, 
  userId,
  conversationId,
}: ChatContentProps) => {
  const {
    messages,
    isLoading,
    error,
    hasMore,
    isLoadingMore,
    loadMore,
    handleSendMessage
  } = useChat(conversationId, userId);

  useEffect(() => {
    const markMessagesAsRead = async () => {
      try {
        const unreadMessages = messages.filter(
          msg => msg.sender_id !== userId && !msg.read_at
        );

        if (unreadMessages.length > 0) {
          const { error } = await supabase
            .from('messages')
            .update({ read_at: new Date().toISOString() })
            .in('id', unreadMessages.map(msg => msg.id));

          if (error) {
            console.error("Error marking messages as read:", error);
          }
        }
      } catch (error) {
        console.error("Error in markMessagesAsRead:", error);
      }
    };

    markMessagesAsRead();
  }, [messages, userId]);

  return (
    <div className="container mx-auto max-w-4xl p-2 sm:p-4 min-h-[calc(100vh-4rem)] animate-fade-in">
      <div className="glass-card h-full flex flex-col rounded-xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg">
        <ChatHeader 
          title={conversationData?.advertisements?.name || "Usuário"} 
          className="animate-slide-in-right"
        />
        <NotificationButton 
          className="animate-fade-in"
          conversationId={conversationId}
          userId={userId}
        />
        <ChatMessages 
          messages={messages}
          isLoading={isLoading}
          error={error}
          userId={userId}
          onLoadMore={loadMore}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          className="flex-1 animate-fade-in"
        />
        <TypingIndicator 
          conversationId={conversationId} 
          currentUserId={userId}
          className="animate-fade-in" 
        />
        <ChatInput 
          onSendMessage={handleSendMessage}
          isBlocked={false}
          conversationId={conversationId}
          className="animate-slide-in-right"
        />
      </div>
    </div>
  );
};