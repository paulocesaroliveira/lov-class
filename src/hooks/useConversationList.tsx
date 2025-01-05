import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CONVERSATIONS_PER_PAGE = 10;

export const useConversationList = (userId: string | undefined) => {
  return useInfiniteQuery({
    queryKey: ["conversations", userId],
    queryFn: async ({ pageParam }) => {
      if (!userId) return { conversations: [], nextPage: null, total: 0 };

      const from = (pageParam as number) * CONVERSATIONS_PER_PAGE;
      const to = from + CONVERSATIONS_PER_PAGE - 1;

      const { data: userConversations, error, count } = await supabase
        .from("conversations")
        .select(`
          id,
          updated_at,
          conversation_participants!inner (
            user_id
          ),
          messages (
            content,
            created_at
          )
        `, { count: 'exact' })
        .eq("conversation_participants.user_id", userId)
        .order("updated_at", { ascending: false })
        .range(from, to);

      if (error) {
        console.error("Error fetching conversations:", error);
        throw error;
      }

      const formattedConversations = await Promise.all(
        (userConversations || []).map(async (conv: any) => {
          const otherParticipants = conv.conversation_participants.filter(
            (p: any) => p.user_id !== userId
          );

          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, name")
            .in(
              "id",
              otherParticipants.map((p: any) => p.user_id)
            );

          const messages = conv.messages || [];
          const lastMessage = messages.length > 0 
            ? messages.sort((a: any, b: any) => 
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              )[0].content 
            : null;

          return {
            id: conv.id,
            updated_at: conv.updated_at,
            participants: profiles?.map((profile) => ({
              user_id: profile.id,
              profile_name: profile.name,
            })) || [],
            last_message: lastMessage,
          };
        })
      );

      const nextPage = count && from + CONVERSATIONS_PER_PAGE < count
        ? (pageParam as number) + 1
        : null;

      return {
        conversations: formattedConversations,
        nextPage,
        total: count || 0
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!userId,
  });
};