import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

type Profile = {
  id: string;
  name: string;
};

type Message = {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender: Profile;
};

export const Messages = () => {
  const { conversationId } = useParams();
  const { session } = useAuth();
  const [newMessage, setNewMessage] = useState("");

  // Fetch messages
  const { data: messages, refetch } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      // First get messages
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (messagesError) throw messagesError;

      // Then get profiles for all senders
      const senderIds = [...new Set(messagesData.map(m => m.sender_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name")
        .in("id", senderIds);

      if (profilesError) throw profilesError;

      // Map profiles to messages
      const messagesWithSenders = messagesData.map(message => ({
        ...message,
        sender: profilesData.find(p => p.id === message.sender_id)
      }));

      return messagesWithSenders as Message[];
    },
    enabled: !!conversationId && !!session?.user,
  });

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !session?.user) return;

    try {
      const { error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: session.user.id,
          content: newMessage.trim(),
        });

      if (error) throw error;

      setNewMessage("");
      refetch();
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error("Erro ao enviar mensagem");
    }
  };

  if (!session) return <div>Faça login para ver as mensagens</div>;

  return (
    <div className="container mx-auto max-w-4xl p-4 space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4 min-h-[500px] flex flex-col">
        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto mb-4">
          {messages?.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === session.user.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender_id === session.user.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm font-medium mb-1">
                  {message.sender?.name}
                </p>
                <p>{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1"
          />
          <Button type="submit">Enviar</Button>
        </form>
      </div>
    </div>
  );
};