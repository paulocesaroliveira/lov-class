import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ConversationParticipant } from "@/types/chat";

export const useConversation = (conversationId: string | undefined) => {
  return useQuery<ConversationParticipant>({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      if (!conversationId) throw new Error("No conversation ID provided");

      console.log("Fetching conversation data for ID:", conversationId);

      const { data, error } = await supabase
        .from("conversation_participants")
        .select(`
          user_id,
          advertisement_id,
          advertisements (
            id,
            name
          )
        `)
        .eq("conversation_id", conversationId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching conversation:", error);
        throw error;
      }
      
      console.log("Conversation data received:", data);
      
      if (!data) {
        console.error("No conversation found for ID:", conversationId);
        return null;
      }
      
      return data;
    },
    enabled: !!conversationId,
  });
};