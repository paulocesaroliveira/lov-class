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
import { useAuth } from "@/hooks/useAuth";

export const ChatContainer = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { session } = useAuth();

  console.log("ChatContainer: Initial render with:", {
    conversationId,
    sessionUserId: session?.user?.id,
    hasSession: !!session,
    hasConversationId: !!conversationId
  });

  const { 
    data: conversationData, 
    isLoading: isLoadingConversation, 
    error: conversationError 
  } = useConversation(conversationId);

  const { 
    data: messages = [], 
    isLoading: isLoadingMessages, 
    error: messagesError,
    refetch 
  } = useMessages(conversationId);

  useMessageSubscription(conversationId, refetch);

  // Verificar autenticação e ID da conversa
  if (!session?.user || !conversationId) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">
          {!session?.user 
            ? "Você precisa estar logado para acessar o chat"
            : "Nenhuma conversa selecionada"}
        </p>
      </div>
    );
  }

  // Verificar estado de carregamento
  if (isLoadingConversation || isLoadingMessages) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Carregando conversa...</p>
      </div>
    );
  }

  // Verificar erros
  if (conversationError || messagesError) {
    console.error("ChatContainer: Errors found:", {
      conversationError,
      messagesError
    });
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Erro ao carregar a conversa</p>
      </div>
    );
  }

  // Verificar se os dados da conversa existem
  if (!conversationData) {
    console.log("ChatContainer: No conversation data found");
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Conversa não encontrada</p>
      </div>
    );
  }

  const handleSendMessage = async (content: string) => {
    if (!session?.user?.id) {
      console.error("ChatContainer: Attempted to send message without user session");
      toast.error("Você precisa estar logado para enviar mensagens");
      return;
    }

    try {
      console.log("ChatContainer: Sending message:", {
        conversationId,
        senderId: session.user.id,
        content
      });

      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        content,
        sender_id: session.user.id,
      });

      if (error) {
        console.error("ChatContainer: Error sending message:", error);
        throw error;
      }

      await refetch();
    } catch (error) {
      console.error("ChatContainer: Error in handleSendMessage:", error);
      toast.error("Erro ao enviar mensagem");
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-2 sm:p-4 h-[calc(100vh-4rem)]">
      <div className="glass-card h-full flex flex-col">
        <ChatHeader title={conversationData?.advertisements?.name || "Usuário"} />
        <NotificationButton />
        <MessageList messages={messages} currentUserId={session?.user?.id} />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};