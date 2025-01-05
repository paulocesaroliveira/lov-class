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
    <div className="container mx-auto max-w-4xl p-2 sm:p-4 h-[calc(100vh-4rem)]">
      <div className="glass-card h-full flex flex-col">
        <ChatHeader title={conversationData?.advertisements?.name || "Usuário"} />
        <NotificationButton />
        <ChatMessages 
          messages={messages}
          isLoading={isLoading}
          error={error}
          userId={userId}
          onLoadMore={loadMore}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
        />
        <TypingIndicator 
          conversationId={conversationId} 
          currentUserId={userId} 
        />
        <ChatInput 
          onSendMessage={handleSendMessage}
          isBlocked={false}
          conversationId={conversationId}
        />
      </div>
    </div>
  );
};