import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const CONVERSATIONS_PER_PAGE = 10;

type Conversation = {
  id: string;
  updated_at: string;
  participants: {
    user_id: string;
    profile_name: string;
  }[];
  last_message: string | null;
};

type ConversationResponse = {
  conversations: Conversation[];
  nextPage: number | null;
  total: number;
};

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
  } = useInfiniteQuery<ConversationResponse>({
    queryKey: ["conversations", session?.user?.id],
    queryFn: async ({ pageParam }) => {
      if (!session?.user?.id) return { conversations: [], nextPage: null, total: 0 };

      console.log("Fetching conversations page:", pageParam);

      const from = (pageParam as number) * CONVERSATIONS_PER_PAGE;
      const to = from + CONVERSATIONS_PER_PAGE - 1;

      const { data: userConversations, error, count } = await supabase
        .from("conversations")
        .select(`
          id,
          updated_at,
          conversation_participants!inner (
            user_id
          ),
          messages (
            content,
            created_at
          )
        `, { count: 'exact' })
        .eq("conversation_participants.user_id", session.user.id)
        .order("updated_at", { ascending: false })
        .range(from, to);

      if (error) {
        console.error("Error fetching conversations:", error);
        throw error;
      }

      console.log("Raw conversations data:", userConversations);

      const formattedConversations = await Promise.all(
        (userConversations || []).map(async (conv: any) => {
          const otherParticipants = conv.conversation_participants.filter(
            (p: any) => p.user_id !== session.user.id
          );

          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, name")
            .in(
              "id",
              otherParticipants.map((p: any) => p.user_id)
            );

          const messages = conv.messages || [];
          const lastMessage = messages.length > 0 
            ? messages.sort((a: any, b: any) => 
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              )[0].content 
            : null;

          return {
            id: conv.id,
            updated_at: conv.updated_at,
            participants: profiles?.map((profile) => ({
              user_id: profile.id,
              profile_name: profile.name,
            })) || [],
            last_message: lastMessage,
          };
        })
      );

      const nextPage = count && from + CONVERSATIONS_PER_PAGE < count
        ? (pageParam as number) + 1
        : null;

      return {
        conversations: formattedConversations,
        nextPage,
        total: count || 0
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleDelete = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from("conversations")
        .delete()
        .eq("id", conversationId);

      if (error) {
        console.error("Error deleting conversation:", error);
        toast.error("Erro ao deletar conversa");
        return;
      }

      toast.success("Conversa deletada com sucesso");
      refetch();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao deletar conversa");
    }
  };

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
        <div className="flex flex-col items-center justify-center h-[calc(100vh-16rem)] space-y-4">
          <MessageSquare className="w-12 h-12 text-muted-foreground" />
          <div className="text-xl font-semibold text-muted-foreground">
            Nenhuma conversa encontrada
          </div>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Quando você iniciar uma conversa com alguém, ela aparecerá aqui.
          </p>
        </div>
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
              <div
                key={conversation.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:border-primary transition-colors bg-black/20 backdrop-blur-sm"
              >
                <Link
                  to={`/mensagens/${conversation.id}`}
                  className="flex-1"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {otherParticipant?.profile_name || "Usuário"}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {conversation.last_message || "Nenhuma mensagem"}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(conversation.updated_at), "dd/MM/yyyy HH:mm", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 text-destructive hover:text-destructive/90"
                  onClick={() => handleDelete(conversation.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
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