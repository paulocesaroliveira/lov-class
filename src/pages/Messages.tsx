import { useAuth } from "@/hooks/useAuth";
import { ChatContainer } from "@/components/chat/ChatContainer";

export const Messages = () => {
  const { session } = useAuth();

  if (!session) return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Faça login para ver as mensagens</h2>
        <p className="text-muted-foreground">Você precisa estar logado para acessar o chat</p>
      </div>
    </div>
  );

  return <ChatContainer />;
};