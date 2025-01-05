import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat";

interface MessagesResponse {
  messages: Message[];
  nextCursor: number | null;
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
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("useMessages: Error fetching messages:", error);
        throw error;
      }
      
      if (!messagesData) {
        console.log("useMessages: No messages found");
        return { messages: [], nextCursor: null };
      }
      
      console.log("useMessages: Messages retrieved:", {
        count: messagesData.length
      });
      
      const messages = messagesData as Message[];
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