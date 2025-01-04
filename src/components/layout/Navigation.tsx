import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, User, Home, Grid, LogOut, Heart, Newspaper, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useAuth();

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return false;

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking admin role:", error);
        return false;
      }
      
      return data?.role === "admin";
    },
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Desconectado com sucesso');
      navigate('/');
    } catch (error) {
      toast.error('Erro ao desconectar');
    }
  };

  const handleNavigation = (path: string) => {
    if (path === '/admin' && !isAdmin) {
      toast.error('Você não tem permissão para acessar esta página');
      return;
    }
    
    if (path === location.pathname) {
      window.location.reload();
    } else {
      navigate(path);
    }
  };

  const menuItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/anuncios', label: 'Anúncios', icon: Grid },
    { path: '/feed', label: 'Feeds', icon: Newspaper },
  ];

  if (session) {
    menuItems.push(
      { path: '/favoritos', label: 'Favoritos', icon: Heart }
    );
  }

  if (isAdmin) {
    menuItems.push(
      { path: '/admin', label: 'Admin', icon: Shield }
    );
  }

  const authItems = !session ? [
    { path: '/login', label: 'Entrar', icon: LogIn },
    { path: '/registro', label: 'Cadastrar', icon: UserPlus },
  ] : [
    { path: '/perfil', label: 'Perfil', icon: User },
    { 
      path: '#', 
      label: 'Sair', 
      icon: LogOut,
      onClick: handleLogout 
    }
  ];

  return {
    menuItems,
    authItems,
    handleNavigation,
    location
  };
};