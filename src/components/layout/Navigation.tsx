import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, MessageSquare, Heart, Download, Settings, Grid, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

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

  // Check if user has admin role
  const isAdmin = session?.user?.user_metadata?.role === 'admin';

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
        {
          label: "Sair",
          icon: Settings,
          onClick: handleSignOut,
        },
        ...adminItems,
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