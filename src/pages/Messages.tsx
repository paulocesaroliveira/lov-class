import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const isMobile = useIsMobile();

  // Fetch messages
  const { data: messages, refetch } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (messagesError) throw messagesError;

      const senderIds = [...new Set(messagesData.map(m => m.sender_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name")
        .in("id", senderIds);

      if (profilesError) throw profilesError;

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

  const onEmojiClick = (emojiObject: any) => {
    setNewMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
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
        {/* Messages */}
        <div className="flex-1 space-y-6 overflow-y-auto p-3 sm:p-4">
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
                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 sm:p-4 ${
                  message.sender_id === session.user.id
                    ? "bg-primary text-primary-foreground ml-4 sm:ml-12"
                    : "bg-black/20 text-white mr-4 sm:mr-12"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm sm:text-base font-medium">
                    {message.sender?.name}
                  </span>
                  <span className="text-xs sm:text-sm opacity-70">
                    {format(new Date(message.created_at), "HH:mm", { locale: ptBR })}
                  </span>
                </div>
                <p className="text-sm sm:text-base whitespace-pre-wrap break-words leading-relaxed">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-2 sm:p-4 bg-black/10 backdrop-blur-sm border-t border-white/10">
          <form onSubmit={sendMessage} className="flex gap-2 relative">
            <div className="relative flex-1">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="pr-10 py-6 sm:py-5 text-base bg-black/20 border-white/10 text-white placeholder:text-white/50"
              />
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2"
              >
                <Smile size={24} />
              </button>
              {showEmojiPicker && (
                <div className={`absolute ${isMobile ? "bottom-full left-0" : "bottom-full right-0"} mb-2`}>
                  <EmojiPicker 
                    onEmojiClick={onEmojiClick}
                    width={isMobile ? window.innerWidth - 32 : 320}
                    height={isMobile ? 300 : 400}
                  />
                </div>
              )}
            </div>
            <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 text-base px-6">
              Enviar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};