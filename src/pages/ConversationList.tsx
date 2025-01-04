import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageSquare } from "lucide-react";

type Conversation = {
  id: string;
  updated_at: string;
  participants: {
    user_id: string;
    profile_name: string;
  }[];
  last_message: string | null;
};

export default function ConversationList() {
  const { session } = useAuth();

  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: ["conversations", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      console.log("Fetching conversations for user:", session.user.id);

      // First get all conversations the user is part of
      const { data: userConversations, error } = await supabase
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
        `)
        .eq("conversation_participants.user_id", session.user.id)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error fetching conversations:", error);
        throw error;
      }

      console.log("Raw conversations data:", userConversations);

      // For each conversation, get the other participant's profile
      const formattedConversations = await Promise.all(
        userConversations.map(async (conv: any) => {
          // Get other participants (excluding current user)
          const otherParticipants = conv.conversation_participants.filter(
            (p: any) => p.user_id !== session.user.id
          );

          // Get profiles for other participants
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, name")
            .in(
              "id",
              otherParticipants.map((p: any) => p.user_id)
            );

          // Get the last message
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

      console.log("Formatted conversations:", formattedConversations);
      return formattedConversations;
    },
    enabled: !!session?.user?.id,
  });

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
              <Link
                key={conversation.id}
                to={`/mensagens/${conversation.id}`}
                className="block p-4 rounded-lg border hover:border-primary transition-colors bg-black/20 backdrop-blur-sm"
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
            );
          })}
        </div>
      </div>
    </div>
  );
}