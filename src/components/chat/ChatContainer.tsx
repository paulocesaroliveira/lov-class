import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { NotificationButton } from "./NotificationButton";
import { ChatHeader } from "./ChatHeader";
import { toast } from "sonner";
import { useMessages } from "./hooks/useMessages";
import { useConversation } from "./hooks/useConversation";
import { useMessageSubscription } from "./hooks/useMessageSubscription";

export const ChatContainer = () => {
  const { conversationId } = useParams();
  
  const { data: conversationData, isLoading: isLoadingConversation } = useConversation(conversationId);
  const { data: messages = [], isLoading: isLoadingMessages, refetch } = useMessages(conversationId);

  useMessageSubscription(conversationId, refetch);

  if (!conversationId) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Nenhuma conversa selecionada</p>
      </div>
    );
  }

  if (isLoadingConversation || isLoadingMessages) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Carregando conversa...</p>
      </div>
    );
  }

  if (!conversationData) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Conversa não encontrada</p>
      </div>
    );
  }

  const handleSendMessage = async (content: string) => {
    try {
      if (!conversationId || !conversationData) {
        throw new Error("Dados da conversa não disponíveis");
      }
      
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        content,
        sender_id: conversationData.user_id,
      });

      if (error) throw error;
      
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