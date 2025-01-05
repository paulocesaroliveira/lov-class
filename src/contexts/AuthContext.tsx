import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  isAdmin: boolean;
  isLoading: boolean;
  userId: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  isLoading: true,
  userId: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        if (!session?.user) {
          console.log('No session found');
          setIsAdmin(false);
          setUserId(null);
          setIsLoading(false);
          return;
        }

        console.log('User ID:', session.user.id);
        setUserId(session.user.id);

        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) {
            console.error('Profile error:', profileError);
            throw profileError;
          }

          if (!profile) {
            const { error: createError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                name: session.user.email?.split('@')[0] || 'User',
                role: 'user'
              });

            if (createError) {
              if (createError.code === '23505') { // Unique violation
                console.log("Perfil já existe, ignorando erro de duplicação");
              } else {
                console.error("Erro ao criar perfil:", createError);
                toast.error("Erro ao criar perfil de usuário");
              }
            }
            setIsAdmin(false);
          } else {
            console.log('User role data:', profile);
            const userIsAdmin = profile.role === 'admin';
            console.log('User Role:', profile.role);
            console.log('Is admin:', userIsAdmin);
            setIsAdmin(userIsAdmin);
          }
        } catch (error) {
          console.error('Error checking/creating profile:', error);
          toast.error('Erro ao verificar/criar perfil');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        toast.error('Erro ao verificar autenticação');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        checkAuth();
      } else if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
        setUserId(null);
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAdmin, isLoading, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);