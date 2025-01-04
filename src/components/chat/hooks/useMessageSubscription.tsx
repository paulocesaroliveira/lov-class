import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useMessageSubscription = (
  conversationId: string | undefined,
  onNewMessage: () => void
) => {
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          onNewMessage();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, onNewMessage]);
};