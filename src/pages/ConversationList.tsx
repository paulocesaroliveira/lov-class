import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
    queryKey: ["conversations"],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      // Primeiro, buscamos as conversas do usuário
      const { data: userConversations, error: conversationsError } = await supabase
        .from("conversations")
        .select(`
          id,
          updated_at,
          conversation_participants!inner(user_id)
        `)
        .contains('conversation_participants.user_id', [session.user.id])
        .order("updated_at", { ascending: false });

      if (conversationsError) throw conversationsError;

      // Para cada conversa, buscamos os detalhes dos participantes e a última mensagem
      const conversationsWithDetails = await Promise.all(
        userConversations.map(async (conv) => {
          // Buscar participantes e seus nomes
          const { data: participants } = await supabase
            .from("conversation_participants")
            .select(`
              user_id,
              profiles!inner(name)
            `)
            .eq("conversation_id", conv.id);

          // Buscar última mensagem
          const { data: messages } = await supabase
            .from("messages")
            .select("content")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1);

          return {
            id: conv.id,
            updated_at: conv.updated_at,
            participants: participants?.map(p => ({
              user_id: p.user_id,
              profile_name: p.profiles.name
            })) || [],
            last_message: messages?.[0]?.content || null
          };
        })
      );

      return conversationsWithDetails;
    },
    enabled: !!session?.user?.id,
  });

  if (isLoading) {
    return <div>Carregando conversas...</div>;
  }

  if (!conversations.length) {
    return <div>Nenhuma conversa encontrada.</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Minhas Conversas</h1>
        <div className="grid gap-4">
          {conversations.map((conversation) => {
            const otherParticipant = conversation.participants.find(
              (p) => p.user_id !== session?.user?.id
            );

            return (
              <Link
                key={conversation.id}
                to={`/mensagens/${conversation.id}`}
                className="block p-4 rounded-lg border hover:border-primary transition-colors"
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