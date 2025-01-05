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

      console.log("useConversation: Fetching conversation:", {
        conversationId,
        userId: session.user.id
      });

      // Primeiro, verificar se a conversa existe
      const { data: conversationExists, error: conversationError } = await supabase
        .from("conversations")
        .select("id")
        .eq("id", conversationId)
        .maybeSingle();

      if (conversationError) {
        console.error("useConversation: Error checking conversation:", conversationError);
        throw conversationError;
      }

      if (!conversationExists) {
        console.error("useConversation: Conversation not found");
        throw new Error("Conversation not found");
      }

      // Verificar se o usuário é participante da conversa
      const { data: participantData, error: participantError } = await supabase
        .from("conversation_participants")
        .select("*")
        .eq("conversation_id", conversationId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (participantError) {
        console.error("useConversation: Error checking participant:", participantError);
        throw participantError;
      }

      if (!participantData) {
        console.error("useConversation: User is not a participant");
        throw new Error("User is not a participant in this conversation");
      }

      // Buscar os detalhes da conversa incluindo o anúncio
      const { data: conversationData, error: detailsError } = await supabase
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
        .maybeSingle();

      if (detailsError) {
        console.error("useConversation: Error fetching conversation details:", detailsError);
        throw detailsError;
      }

      if (!conversationData) {
        console.error("useConversation: No conversation details found");
        throw new Error("Conversation details not found");
      }

      console.log("useConversation: Successfully fetched conversation data:", conversationData);
      return conversationData;
    },
    enabled: !!conversationId && !!session?.user?.id,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false
  });
};