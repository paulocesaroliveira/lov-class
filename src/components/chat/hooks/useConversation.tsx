import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ConversationParticipant } from "@/types/chat";

export const useConversation = (conversationId: string | undefined) => {
  return useQuery<ConversationParticipant>({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      if (!conversationId) throw new Error("No conversation ID provided");

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
        .single();

      if (error) throw error;
      if (!data) throw new Error("No conversation found");
      
      return data;
    },
    enabled: !!conversationId,
  });
};