import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ConversationParticipant } from "@/types/chat";

export const useConversation = (conversationId: string | undefined) => {
  return useQuery<ConversationParticipant>({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      if (!conversationId) throw new Error("No conversation ID provided");

      console.log("Fetching conversation data for ID:", conversationId);

      // First check if the user is a participant in this conversation
      const { data: participantData, error: participantError } = await supabase
        .from("conversation_participants")
        .select("*")
        .eq("conversation_id", conversationId)
        .single();

      if (participantError) {
        console.error("Error checking conversation participant:", participantError);
        throw participantError;
      }

      if (!participantData) {
        console.error("User is not a participant in this conversation");
        throw new Error("User is not a participant in this conversation");
      }

      // Then get the conversation details
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