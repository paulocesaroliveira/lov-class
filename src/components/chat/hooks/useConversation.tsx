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

      console.log("useConversation: Starting fetch with new approach for:", {
        conversationId,
        userId: session.user.id
      });

      const { data, error } = await supabase
        .from("conversations")
        .select(`
          id,
          conversation_participants!inner (
            user_id,
            advertisement_id,
            advertisements (
              id,
              name,
              profile_id
            )
          )
        `)
        .eq("id", conversationId)
        .maybeSingle();

      if (error) {
        console.error("useConversation: Error fetching conversation:", error);
        throw error;
      }

      if (!data) {
        console.error("useConversation: No conversation found");
        throw new Error("No conversation found");
      }

      console.log("useConversation: Raw conversation data:", data);

      const participants = data.conversation_participants;
      const relevantParticipant = participants.find(p => 
        p.advertisement_id !== null || p.user_id !== session.user.id
      ) || participants[0];

      if (!relevantParticipant) {
        console.error("useConversation: No relevant participant found");
        throw new Error("No relevant participant found");
      }

      console.log("useConversation: Using participant data:", relevantParticipant);
      
      return {
        user_id: relevantParticipant.user_id,
        advertisement_id: relevantParticipant.advertisement_id,
        advertisements: relevantParticipant.advertisements
      };
    },
    enabled: !!conversationId && !!session?.user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false
  });
};