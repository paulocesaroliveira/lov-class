import { useParams } from "react-router-dom";
import { useMessages } from "./hooks/useMessages";
import { useConversation } from "./hooks/useConversation";
import { useMessageSubscription } from "./hooks/useMessageSubscription";
import { useAuth } from "@/hooks/useAuth";
import { ChatLoading } from "./components/ChatLoading";
import { ChatError } from "./components/ChatError";
import { ChatEmpty } from "./components/ChatEmpty";
import { ChatContent } from "./components/ChatContent";

export const ChatContainer = () => {
  const { id: conversationId } = useParams<{ id: string }>();
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

  if (!session?.user || !conversationId) {
    console.log("ChatContainer: Missing session or conversationId", {
      hasSession: !!session?.user,
      conversationId
    });
    return (
      <ChatEmpty 
        message={!session?.user 
          ? "Você precisa estar logado para acessar o chat"
          : "Nenhuma conversa selecionada"
        }
      />
    );
  }

  if (isLoadingConversation || isLoadingMessages) {
    console.log("ChatContainer: Loading state", {
      isLoadingConversation,
      isLoadingMessages
    });
    return <ChatLoading />;
  }

  if (conversationError || messagesError) {
    console.error("ChatContainer: Errors found:", {
      conversationError,
      messagesError
    });
    return <ChatError />;
  }

  if (!conversationData) {
    console.log("ChatContainer: No conversation data found");
    return <ChatEmpty message="Conversa não encontrada" />;
  }

  return (
    <ChatContent 
      conversationData={conversationData}
      userId={session.user.id}
      conversationId={conversationId}
    />
  );
};