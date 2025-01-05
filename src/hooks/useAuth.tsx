import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          if (error.message.includes('refresh_token_not_found')) {
            // Clear any stale session data
            await supabase.auth.signOut();
          }
          return;
        }

        setSession(initialSession);
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      console.log("Auth state changed:", _event);
      setSession(currentSession);
      setLoading(false);

      if (_event === 'SIGNED_OUT') {
        // Clear any stored tokens
        await supabase.auth.signOut();
      } else if (_event === 'TOKEN_REFRESHED') {
        console.log("Token refreshed successfully");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
};