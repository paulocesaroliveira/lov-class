import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ConversationParticipant } from "@/types/chat";
import { useAuth } from "@/hooks/useAuth";

export const useConversation = (conversationId: string | undefined) => {
  const { session } = useAuth();

  return useQuery<ConversationParticipant>({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      if (!conversationId) {
        console.error("useConversation: No conversation ID provided");
        throw new Error("No conversation ID provided");
      }
      
      if (!session?.user?.id) {
        console.error("useConversation: No user session found");
        throw new Error("No user session found");
      }

      console.log("useConversation: Starting fetch for:", {
        conversationId,
        userId: session.user.id
      });

      // First check if the user is a participant in this conversation
      const { data: participantData, error: participantError } = await supabase
        .from("conversation_participants")
        .select("*")
        .eq("conversation_id", conversationId)
        .eq("user_id", session.user.id)
        .single();

      if (participantError) {
        console.error("useConversation: Error checking participant:", participantError);
        throw participantError;
      }

      if (!participantData) {
        console.error("useConversation: User is not a participant");
        throw new Error("User is not a participant in this conversation");
      }

      console.log("useConversation: Participant data found:", participantData);

      // Then get the conversation details including the advertisement
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
        .neq("user_id", session.user.id)
        .single();

      if (error) {
        console.error("useConversation: Error fetching conversation:", error);
        throw error;
      }

      console.log("useConversation: Conversation data retrieved:", data);
      return data;
    },
    enabled: !!conversationId && !!session?.user?.id,
  });
};