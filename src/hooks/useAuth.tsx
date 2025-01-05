import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Inicializando useAuth...");
    
    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log("Obtendo sessão inicial...");
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao obter sessão:", error);
          if (error.message.includes('refresh_token_not_found')) {
            console.log("Token de atualização não encontrado, limpando sessão...");
            await supabase.auth.signOut();
          }
          return;
        }

        console.log("Sessão inicial:", initialSession);
        setSession(initialSession);
      } catch (error) {
        console.error("Erro na inicialização da autenticação:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      console.log("Estado de autenticação alterado:", _event);
      setSession(currentSession);
      setLoading(false);

      if (_event === 'SIGNED_OUT') {
        console.log("Usuário desconectado, limpando tokens...");
        await supabase.auth.signOut();
      } else if (_event === 'TOKEN_REFRESHED') {
        console.log("Token atualizado com sucesso");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
};