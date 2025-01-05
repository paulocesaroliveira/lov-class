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

        // If we have a session, ensure the user has a profile
        if (initialSession?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', initialSession.user.id)
            .maybeSingle();

          if (profileError) {
            console.error("Erro ao verificar perfil:", profileError);
            return;
          }

          // If no profile exists, create one
          if (!profile) {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: initialSession.user.id,
                name: initialSession.user.email?.split('@')[0] || 'User',
                role: 'user'
              });

            if (insertError) {
              console.error("Erro ao criar perfil:", insertError);
              toast.error("Erro ao criar perfil de usuário");
              return;
            }
          }
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      console.log("Estado de autenticação alterado:", _event);
      
      if (currentSession?.user) {
        // Check/create profile when auth state changes
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Erro ao verificar perfil:", profileError);
          return;
        }

        if (!profile) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: currentSession.user.id,
              name: currentSession.user.email?.split('@')[0] || 'User',
              role: 'user'
            });

          if (insertError) {
            console.error("Erro ao criar perfil:", insertError);
            toast.error("Erro ao criar perfil de usuário");
            return;
          }
        }
      }
      
      setSession(currentSession);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
};