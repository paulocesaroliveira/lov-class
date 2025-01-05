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
          setLoading(false);
          return;
        }

        console.log("Sessão inicial:", initialSession);
        setSession(initialSession);
        setLoading(false);

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

          if (!profile) {
            try {
              const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                  id: initialSession.user.id,
                  name: initialSession.user.email?.split('@')[0] || 'User',
                  role: 'user'
                });

              if (insertError) {
                if (insertError.code === '23505') { // Unique violation
                  console.log("Perfil já existe, ignorando erro de duplicação");
                } else {
                  console.error("Erro ao criar perfil:", insertError);
                  toast.error("Erro ao criar perfil de usuário");
                }
                return;
              }
              
              console.log("Perfil criado com sucesso!");
            } catch (error) {
              console.error("Erro ao criar perfil:", error);
              toast.error("Erro ao criar perfil de usuário");
              return;
            }
          }
        }
      } catch (error) {
        console.error("Erro na inicialização da autenticação:", error);
        setSession(null);
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
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