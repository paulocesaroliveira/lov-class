import { useAuth } from "@/hooks/useAuth";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { ConversationItem } from "@/components/conversation/ConversationItem";
import { EmptyState } from "@/components/conversation/EmptyState";
import { useConversationList } from "@/hooks/useConversationList";
import { MessageCircle } from "lucide-react";

export default function ConversationList() {
  const { session } = useAuth();
  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useConversationList(session?.user?.id);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!session?.user) {
    return (
      <div className="container mx-auto max-w-4xl p-4">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-16rem)] text-center space-y-4">
          <MessageCircle className="h-16 w-16 text-primary/50" />
          <h2 className="text-2xl font-bold">Faça login para ver suas mensagens</h2>
          <p className="text-muted-foreground">
            Você precisa estar logado para acessar suas conversas
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl p-4">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Minhas Conversas</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-black/20 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const conversations = data?.pages.flatMap(page => page.conversations) || [];

  if (!conversations.length) {
    return (
      <div className="container mx-auto max-w-4xl p-4">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 animate-fade-in">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Minhas Conversas</h1>
        <div className="grid gap-4">
          {conversations.map((conversation) => {
            const otherParticipant = conversation.participants[0];

            return (
              <ConversationItem
                key={conversation.id}
                id={conversation.id}
                otherParticipant={otherParticipant}
                lastMessage={conversation.last_message}
                updatedAt={conversation.updated_at}
                onDelete={refetch}
              />
            );
          })}
          {hasNextPage && (
            <div ref={ref} className="flex justify-center p-4">
              <div className="animate-pulse text-muted-foreground">
                Carregando mais conversas...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}