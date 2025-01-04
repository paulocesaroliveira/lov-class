import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, MessageSquare, Heart, Download, Settings, Grid, Users, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const navigationItems = [
  { path: "/", label: "Início", icon: Home },
  { path: "/anuncios", label: "Anúncios", icon: Search },
  { path: "/feed", label: "Feed", icon: Grid },
  { path: "/mensagens/lista", label: "Mensagens", icon: MessageSquare },
  { path: "/favoritos", label: "Favoritos", icon: Heart },
  { path: "/instalar", label: "Instalar App", icon: Download },
];

export const useNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const { data: userRole, isLoading } = useQuery({
    queryKey: ['user-role', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        console.log('No user session');
        return null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        toast.error('Erro ao verificar permissões');
        return null;
      }

      console.log('User role data:', data);
      return data?.role;
    },
    enabled: !!session?.user?.id,
  });

  const isAdmin = userRole === 'admin';
  console.log('User ID:', session?.user?.id);
  console.log('User Role:', userRole);
  console.log('Is admin:', isAdmin);

  const adminItems = isAdmin
    ? [
        {
          path: "/admin",
          label: "Admin",
          icon: Users,
        },
      ]
    : [];

  const authItems = session
    ? [
        {
          path: "/perfil",
          label: "Perfil",
          icon: Settings,
        },
        ...adminItems,
        {
          label: "Sair",
          icon: LogOut,
          onClick: handleSignOut,
        },
      ]
    : [
        {
          path: "/login",
          label: "Entrar",
          icon: Settings,
        },
        {
          path: "/registro",
          label: "Criar conta",
          icon: Settings,
        },
      ];

  return {
    menuItems: navigationItems,
    authItems,
    handleNavigation,
    location,
  };
};