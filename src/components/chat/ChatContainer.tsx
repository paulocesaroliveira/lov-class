import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { NotificationButton } from "./NotificationButton";
import { Message } from "@/types/chat";

export const ChatContainer = () => {
  const { conversationId } = useParams();
  
  // Get conversation details including advertisement
  const { data: conversationData } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      if (!conversationId) return null;

      const { data, error } = await supabase
        .from("conversation_participants")
        .select(`
          user_id,
          advertisement_id,
          advertisements (
            id,
            name
          )
        `)
        .eq("conversation_id", conversationId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!conversationId,
  });

  // Get messages
  const { data: messages = [], refetch } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];

      const { data: messagesData, error } = await supabase
        .from("messages")
        .select(`
          id,
          content,
          sender_id,
          created_at,
          conversation_id,
          read_at,
          sender:profiles!sender_id(name)
        `)
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      // Transform messages to include advertisement name for sender
      return messagesData.map(msg => ({
        ...msg,
        sender: {
          name: conversationData?.advertisements?.name || msg.sender?.name || "Usuário"
        }
      })) as Message[];
    },
    enabled: !!conversationId && !!conversationData,
  });

  // Setup realtime subscription
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, refetch]);

  return (
    <div className="container mx-auto max-w-4xl p-2 sm:p-4 h-[calc(100vh-4rem)]">
      <div className="glass-card h-full flex flex-col">
        <NotificationButton />
        <MessageList messages={messages} currentUserId={conversationData?.user_id} />
        <MessageInput onSendMessage={async (content) => {
          if (!conversationId) return;
          
          await supabase.from("messages").insert({
            conversation_id: conversationId,
            content,
            sender_id: conversationData?.user_id,
          });
          
          refetch();
        }} />
      </div>
    </div>
  );
};