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

      // Buscar diretamente os dados da conversa com o anúncio
      const { data: conversationData, error } = await supabase
        .from("conversation_participants")
        .select(`
          conversation_id,
          user_id,
          advertisement_id,
          advertisements (
            id,
            name,
            profile_id
          )
        `)
        .eq("conversation_id", conversationId)
        .eq("user_id", session.user.id)
        .single();

      if (error) {
        console.error("useConversation: Error fetching conversation:", error);
        throw error;
      }

      if (!conversationData) {
        console.error("useConversation: No conversation data found");
        throw new Error("Conversation not found");
      }

      console.log("useConversation: Successfully fetched conversation data:", conversationData);
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