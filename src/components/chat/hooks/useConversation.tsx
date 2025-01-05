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

      console.log("useConversation: Starting fetch for conversation:", {
        conversationId,
        userId: session.user.id
      });

      // First, get all participants in the conversation
      const { data: participants, error: participantsError } = await supabase
        .from("conversation_participants")
        .select(`
          user_id,
          advertisement_id,
          advertisements (
            id,
            name,
            profile_id
          )
        `)
        .eq("conversation_id", conversationId);

      if (participantsError) {
        console.error("useConversation: Error fetching participants:", participantsError);
        throw participantsError;
      }

      console.log("useConversation: Found participants:", participants);

      // Find the other participant's data (not the current user)
      const otherParticipant = participants?.find(p => p.user_id !== session.user.id);
      const currentUserParticipant = participants?.find(p => p.user_id === session.user.id);

      // Use the other participant's data if available, otherwise use current user's data
      const conversationData = otherParticipant || currentUserParticipant;

      if (!conversationData) {
        console.error("useConversation: No participant data found");
        throw new Error("No participant data found");
      }

      console.log("useConversation: Using conversation data:", conversationData);

      return {
        user_id: conversationData.user_id,
        advertisement_id: conversationData.advertisement_id,
        advertisements: conversationData.advertisements
      };
    },
    enabled: !!conversationId && !!session?.user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false
  });
};