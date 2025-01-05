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

      // Buscar participante com dados do anúncio em uma única query
      const { data: participantData, error } = await supabase
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
        .eq("conversation_id", conversationId)
        .neq("user_id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("useConversation: Error fetching participant:", error);
        throw error;
      }

      // Se não encontrou o outro participante, buscar os dados do usuário atual
      if (!participantData) {
        console.log("useConversation: No other participant found, fetching current user data");
        
        const { data: selfData, error: selfError } = await supabase
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
          .eq("conversation_id", conversationId)
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (selfError) {
          console.error("useConversation: Error fetching self data:", selfError);
          throw selfError;
        }

        if (!selfData) {
          console.error("useConversation: No conversation data found at all");
          throw new Error("No conversation data found");
        }

        console.log("useConversation: Using self data:", selfData);
        return selfData;
      }

      console.log("useConversation: Using other participant data:", participantData);
      return participantData;
    },
    enabled: !!conversationId && !!session?.user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false
  });
};