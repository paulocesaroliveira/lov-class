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

      // Primeiro, verificar se o usuário é participante da conversa
      const { data: participantCheck, error: participantError } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("conversation_id", conversationId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (participantError) {
        console.error("useConversation: Error checking participant:", participantError);
        throw participantError;
      }

      if (!participantCheck) {
        console.error("useConversation: User is not a participant in this conversation");
        throw new Error("User is not a participant in this conversation");
      }

      // Buscar os detalhes da conversa e do anúncio
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

      // Se não encontrou os dados do outro participante, buscar os próprios dados
      if (!conversationData || detailsError) {
        console.log("useConversation: Fetching self data as other participant not found");
        
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
          .single();

        if (selfError || !selfData) {
          console.error("useConversation: Error fetching conversation details:", selfError);
          throw new Error("Failed to fetch conversation details");
        }

        console.log("useConversation: Successfully fetched self data:", selfData);
        return {
          user_id: selfData.user_id,
          advertisement_id: selfData.advertisement_id,
          advertisements: selfData.advertisements
        };
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