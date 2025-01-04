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
    user: {
      profile: {
        name: string;
      };
    };
  }[];
  last_message: {
    content: string;
  }[];
};

export default function ConversationList() {
  const { session } = useAuth();

  const { data: conversations, isLoading } = useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          id,
          updated_at,
          participants:conversation_participants(
            user_id,
            user:profiles!inner(name)
          ),
          last_message:messages(content)
        `)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error fetching conversations:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  if (isLoading) {
    return <div>Carregando conversas...</div>;
  }

  if (!conversations?.length) {
    return <div>Nenhuma conversa encontrada.</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Minhas Conversas</h1>
      <div className="grid gap-4">
        {conversations.map((conversation) => {
          const otherParticipant = conversation.participants.find(
            (p) => p.user_id !== session?.user?.id
          );
          const lastMessage = conversation.last_message[0]?.content;

          return (
            <Link
              key={conversation.id}
              to={`/mensagens/${conversation.id}`}
              className="block p-4 rounded-lg border hover:border-primary transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    {otherParticipant?.user?.profile?.name || "Usuário"}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {lastMessage || "Nenhuma mensagem"}
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
  );
}