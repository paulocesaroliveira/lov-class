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

      // Buscar todos os participantes da conversa
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

      if (!participants || participants.length === 0) {
        console.error("useConversation: No participants found");
        throw new Error("No participants found");
      }

      console.log("useConversation: Found participants:", participants);

      // Primeiro tentar encontrar o outro participante
      const otherParticipant = participants.find(p => p.user_id !== session.user.id);
      
      // Se não encontrar o outro participante, usar os dados do usuário atual
      const participantData = otherParticipant || participants.find(p => p.user_id === session.user.id);

      if (!participantData) {
        console.error("useConversation: No participant data found");
        throw new Error("No participant data found");
      }

      console.log("useConversation: Using participant data:", participantData);

      return participantData;
    },
    enabled: !!conversationId && !!session?.user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false
  });
};