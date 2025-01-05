import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat";

const MESSAGES_PER_PAGE = 20;

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
  return useInfiniteQuery({
    queryKey: ["messages", conversationId],
    queryFn: async ({ pageParam = 0 }) => {
      if (!conversationId) {
        console.error("useMessages: No conversation ID provided");
        return { messages: [], nextCursor: null };
      }

      const from = pageParam * MESSAGES_PER_PAGE;
      const to = from + MESSAGES_PER_PAGE - 1;

      console.log("useMessages: Fetching messages for conversation:", {
        conversationId,
        from,
        to
      });

      const { data: messagesData, error, count } = await supabase
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
        count: messagesData.length,
        total: count
      });
      
      const messages = (messagesData as MessageResponse[]).map(msg => ({
        id: msg.id,
        content: msg.content,
        sender_id: msg.sender_id,
        created_at: msg.created_at,
        conversation_id: msg.conversation_id,
        read_at: msg.read_at,
        sender: msg.sender_name ? { name: msg.sender_name } : null
      }));

      const nextCursor = count && from + MESSAGES_PER_PAGE < count 
        ? pageParam + 1 
        : null;

      return { messages, nextCursor };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
    enabled: !!conversationId,
  });
};