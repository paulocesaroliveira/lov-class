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

      // Buscar os detalhes da conversa incluindo o anúncio e o outro participante
      const { data: conversationData, error: detailsError } = await supabase
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
        .neq("user_id", session.user.id)
        .maybeSingle();

      if (detailsError) {
        console.error("useConversation: Error fetching conversation details:", detailsError);
        throw detailsError;
      }

      // Se não encontrou dados do outro participante, tentar buscar os próprios dados
      if (!conversationData) {
        const { data: selfData, error: selfError } = await supabase
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
          .maybeSingle();

        if (selfError) {
          console.error("useConversation: Error fetching self conversation details:", selfError);
          throw selfError;
        }

        if (!selfData) {
          console.error("useConversation: No conversation data found");
          throw new Error("Conversation not found");
        }

        console.log("useConversation: Found self conversation data:", selfData);
        return {
          user_id: selfData.user_id,
          advertisement_id: selfData.advertisement_id,
          advertisements: selfData.advertisements
        };
      }

      console.log("useConversation: Found other participant data:", conversationData);
      return {
        user_id: conversationData.user_id,
        advertisement_id: conversationData.advertisement_id,
        advertisements: conversationData.advertisements
      };
    },
    enabled: !!conversationId && !!session?.user?.id,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false
  });
};