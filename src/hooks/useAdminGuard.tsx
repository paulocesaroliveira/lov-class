import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAdminGuard = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (!session?.user?.id) {
          console.log('No session found, redirecting to login');
          toast.error('Você precisa estar logado para acessar esta página');
          navigate('/login');
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error checking admin role:', error);
          toast.error('Erro ao verificar permissões de administrador');
          navigate('/');
          return;
        }

        const userIsAdmin = profile?.role === 'admin';
        console.log('Admin check result:', { userId: session.user.id, role: profile?.role, isAdmin: userIsAdmin });
        
        setIsAdmin(userIsAdmin);
        
        if (!userIsAdmin) {
          console.log('User is not admin, redirecting to home');
          toast.error('Você não tem permissão para acessar esta página');
          navigate('/');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('Erro inesperado ao verificar permissões');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [session, navigate]);

  return { isLoading, isAdmin };
};