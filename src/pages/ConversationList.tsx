import { useAuth } from "@/hooks/useAuth";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { ConversationItem } from "@/components/conversation/ConversationItem";
import { EmptyState } from "@/components/conversation/EmptyState";
import { useConversationList } from "@/hooks/useConversationList";

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

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl p-4">
        <div className="flex items-center justify-center h-[calc(100vh-16rem)]">
          <div className="animate-pulse text-muted-foreground">
            Carregando conversas...
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
    <div className="container mx-auto max-w-4xl p-4">
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