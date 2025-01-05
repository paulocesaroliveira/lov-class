import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useMessageSubscription = (
  conversationId: string | undefined,
  onNewMessage: () => void
) => {
  const retryCount = useRef(0);
  const maxRetries = 5;
  const subscriptionRef = useRef<ReturnType<typeof supabase.channel>>();

  useEffect(() => {
    if (!conversationId) return;

    const setupSubscription = () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }

      const subscription = supabase
        .channel(`messages:${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`
          },
          () => {
            console.log('New message received, refreshing...');
            onNewMessage();
            retryCount.current = 0; // Reset retry count on successful message
          }
        )
        .subscribe((status) => {
          console.log('Subscription status:', status);
          
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to messages');
            retryCount.current = 0;
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            console.log('Subscription closed or error, attempting reconnect...');
            handleReconnect();
          }
        });

      subscriptionRef.current = subscription;
    };

    const handleReconnect = () => {
      if (retryCount.current >= maxRetries) {
        toast.error('Erro de conexão. Tente recarregar a página.');
        return;
      }

      const delay = Math.min(1000 * Math.pow(2, retryCount.current), 10000);
      retryCount.current++;

      console.log(`Attempting reconnect in ${delay}ms (attempt ${retryCount.current})`);
      
      setTimeout(() => {
        setupSubscription();
      }, delay);
    };

    setupSubscription();

    // Cleanup subscription on unmount
    return () => {
      if (subscriptionRef.current) {
        console.log('Cleaning up subscription');
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [conversationId, onNewMessage]);
};