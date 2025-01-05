import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat";

interface MessageWithSender {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  conversation_id: string;
  read_at: string | null;
  sender_name: string;
}

export const useMessages = (conversationId: string | undefined) => {
  return useInfiniteQuery({
    queryKey: ["messages", conversationId],
    queryFn: async ({ pageParam = 0 }) => {
      if (!conversationId) {
        console.error("useMessages: No conversation ID provided");
        return { messages: [], nextCursor: null };
      }

      const from = pageParam * 20;
      const to = from + 19;

      console.log("useMessages: Fetching messages for conversation:", {
        conversationId,
        from,
        to
      });

      const { data: messagesData, error } = await supabase
        .rpc('get_messages_with_sender_names', {
          p_conversation_id: conversationId
        })
        .range(from, to);

      if (error) {
        console.error("useMessages: Error fetching messages:", error);
        throw error;
      }
      
      if (!messagesData) {
        console.log("useMessages: No messages found");
        return { messages: [], nextCursor: null };
      }
      
      console.log("useMessages: Messages retrieved:", {
        count: messagesData.length,
        messages: messagesData
      });
      
      // Transform the raw message data to match our Message type
      const messages: Message[] = messagesData.map((msg: MessageWithSender) => ({
        id: msg.id,
        content: msg.content,
        sender_id: msg.sender_id,
        created_at: msg.created_at,
        conversation_id: msg.conversation_id,
        read_at: msg.read_at,
        sender: msg.sender_name ? { name: msg.sender_name } : null
      }));

      const nextCursor = messages.length === 20 ? pageParam + 1 : null;

      return { messages, nextCursor };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5, // Cache válido por 5 minutos
    gcTime: 1000 * 60 * 30, // Manter no cache por 30 minutos
    refetchOnWindowFocus: false,
    retry: 3
  });
};