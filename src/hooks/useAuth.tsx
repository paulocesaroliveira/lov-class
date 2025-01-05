import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Inicializando useAuth...");
    
    const initializeAuth = async () => {
      try {
        console.log("Obtendo sessão inicial...");
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao obter sessão:", error);
          if (error.message.includes('refresh_token_not_found')) {
            console.log("Token de atualização não encontrado, limpando sessão...");
            setSession(null);
          }
          return;
        }

        console.log("Sessão inicial:", initialSession);
        setSession(initialSession);
      } catch (error) {
        console.error("Erro na inicialização da autenticação:", error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      console.log("Estado de autenticação alterado:", _event);
      setSession(currentSession);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
};