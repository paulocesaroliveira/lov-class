import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { NotificationButton } from "./NotificationButton";
import { ChatHeader } from "./ChatHeader";
import { Message, ConversationParticipant } from "@/types/chat";
import { toast } from "sonner";

export const ChatContainer = () => {
  const { conversationId } = useParams();
  
  const { data: conversationData } = useQuery<ConversationParticipant>({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      if (!conversationId) throw new Error("No conversation ID provided");

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
      if (!data) throw new Error("No conversation found");
      
      return data;
    },
    enabled: !!conversationId,
  });

  const { data: messages = [], refetch } = useQuery<Message[]>({
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
          profiles!sender_id (
            name
          )
        `)
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      if (!messagesData) return [];
      
      return messagesData.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender_id: msg.sender_id,
        created_at: msg.created_at,
        conversation_id: msg.conversation_id,
        read_at: msg.read_at,
        sender: msg.profiles ? { name: msg.profiles.name } : null
      })) as Message[];
    },
    enabled: !!conversationId && !!conversationData,
  });

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages:${conversationId}`)
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

  if (!conversationId) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Nenhuma conversa selecionada</p>
      </div>
    );
  }

  const handleSendMessage = async (content: string) => {
    try {
      if (!conversationId || !conversationData) {
        throw new Error("Dados da conversa não disponíveis");
      }
      
      await supabase.from("messages").insert({
        conversation_id: conversationId,
        content,
        sender_id: conversationData.user_id,
      });
      
      refetch();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem");
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-2 sm:p-4 h-[calc(100vh-4rem)]">
      <div className="glass-card h-full flex flex-col">
        <ChatHeader title={conversationData?.advertisements?.name || "Usuário"} />
        <NotificationButton />
        <MessageList messages={messages} currentUserId={conversationData?.user_id} />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};