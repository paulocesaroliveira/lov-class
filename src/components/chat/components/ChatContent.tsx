import { useEffect } from "react";
import { MessageList } from "../MessageList";
import { MessageInput } from "../MessageInput";
import { NotificationButton } from "../NotificationButton";
import { ChatHeader } from "../ChatHeader";
import { TypingIndicator } from "./TypingIndicator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ChatContentProps {
  conversationData: {
    advertisements?: {
      name: string;
    };
  };
  messages: any[];
  userId: string;
  conversationId: string;
  onRefetch: () => void;
}

export const ChatContent = ({ 
  conversationData, 
  messages, 
  userId,
  conversationId,
  onRefetch 
}: ChatContentProps) => {
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
          } else {
            onRefetch();
          }
        }
      } catch (error) {
        console.error("Error in markMessagesAsRead:", error);
      }
    };

    markMessagesAsRead();
  }, [messages, userId, onRefetch]);

  const handleSendMessage = async (content: string) => {
    try {
      console.log("ChatContent: Sending message:", {
        conversationId,
        senderId: userId,
        content
      });

      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        content,
        sender_id: userId,
      });

      if (error) {
        console.error("ChatContent: Error sending message:", error);
        throw error;
      }

      await onRefetch();
    } catch (error) {
      console.error("ChatContent: Error in handleSendMessage:", error);
      toast.error("Erro ao enviar mensagem");
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-2 sm:p-4 h-[calc(100vh-4rem)]">
      <div className="glass-card h-full flex flex-col">
        <ChatHeader title={conversationData?.advertisements?.name || "Usuário"} />
        <NotificationButton />
        <MessageList messages={messages} currentUserId={userId} />
        <TypingIndicator conversationId={conversationId} currentUserId={userId} />
        <MessageInput 
          onSendMessage={handleSendMessage} 
          conversationId={conversationId}
        />
      </div>
    </div>
  );
};