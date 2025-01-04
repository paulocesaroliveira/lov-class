import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { Message } from "@/types/chat";

export const Messages = () => {
  const { conversationId } = useParams();
  const { session } = useAuth();
  const [notificationPermission, setNotificationPermission] = useState(
    Notification.permission
  );

  const { data: messages = [], refetch } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];

      const { data: messagesData, error } = await supabase
        .from("messages")
        .select(`
          id,
          content,
          sender_id,
          created_at,
          conversation_id,
          read_at,
          sender:profiles(name)
        `)
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        throw error;
      }

      console.log("Fetched messages:", messagesData);
      
      // Transform the data to match our Message type
      const transformedMessages = messagesData.map(msg => ({
        ...msg,
        sender: msg.sender ? { name: msg.sender[0]?.name } : null
      }));

      return transformedMessages as Message[];
    },
    enabled: !!conversationId && !!session?.user,
  });

  // Configurar listener para novas mensagens
  useEffect(() => {
    if (!session?.user?.id || !conversationId) return;

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          console.log("Nova mensagem recebida:", payload);
          
          // Não mostrar notificação se a mensagem for do usuário atual
          if (payload.new.sender_id === session.user.id) {
            console.log("Mensagem do usuário atual, atualizando lista...");
            refetch();
            return;
          }

          // Buscar informações do remetente
          const { data: senderData } = await supabase
            .from("profiles")
            .select("name")
            .eq("id", payload.new.sender_id)
            .single();

          // Mostrar notificação se permitido
          if (notificationPermission === "granted" && document.hidden) {
            new Notification("Nova mensagem", {
              body: `${senderData?.name}: ${payload.new.content}`,
              icon: "/favicon.ico",
            });
          }
          
          refetch();
        }
      )
      .subscribe();

    return () => {
      console.log("Desconectando do canal de mensagens");
      supabase.removeChannel(channel);
    };
  }, [conversationId, session?.user?.id, notificationPermission, refetch]);

  const sendMessage = async (content: string) => {
    if (!session?.user?.id || !conversationId) return;

    try {
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: session.user.id,
        content: content,
      });

      if (error) throw error;
      
      // Atualizar a lista de mensagens imediatamente após enviar
      refetch();
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error("Erro ao enviar mensagem");
      throw error;
    }
  };

  if (!session) return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Faça login para ver as mensagens</h2>
        <p className="text-muted-foreground">Você precisa estar logado para acessar o chat</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto max-w-4xl p-2 sm:p-4 h-[calc(100vh-4rem)]">
      <div className="glass-card h-full flex flex-col">
        {notificationPermission === "default" && (
          <div className="bg-primary/10 p-2 text-center">
            <p className="text-sm mb-2">
              Ative as notificações para receber alertas de novas mensagens
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  const permission = await Notification.requestPermission();
                  setNotificationPermission(permission);
                  if (permission === "granted") {
                    toast.success("Notificações ativadas com sucesso!");
                  }
                } catch (error) {
                  console.error("Erro ao solicitar permissão:", error);
                  toast.error("Erro ao ativar notificações");
                }
              }}
              className="bg-primary/20 hover:bg-primary/30"
            >
              Ativar Notificações
            </Button>
          </div>
        )}

        <MessageList 
          messages={messages} 
          currentUserId={session.user.id} 
        />
        
        <MessageInput onSendMessage={sendMessage} />
      </div>
    </div>
  );
};