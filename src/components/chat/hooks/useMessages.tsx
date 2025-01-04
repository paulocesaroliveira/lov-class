import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat";

interface MessageResponse {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  conversation_id: string;
  read_at: string | null;
  sender_name: string | null;
}

export const useMessages = (conversationId: string | undefined) => {
  return useQuery<Message[]>({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];

      const { data: messagesData, error } = await supabase
        .rpc('get_messages_with_sender_names', {
          p_conversation_id: conversationId
        });

      if (error) throw error;
      if (!messagesData) return [];
      
      return (messagesData as MessageResponse[]).map(msg => ({
        id: msg.id,
        content: msg.content,
        sender_id: msg.sender_id,
        created_at: msg.created_at,
        conversation_id: msg.conversation_id,
        read_at: msg.read_at,
        sender: msg.sender_name ? { name: msg.sender_name } : null
      }));
    },
    enabled: !!conversationId,
  });
};