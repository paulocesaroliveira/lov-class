import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, MessageSquare, Heart, Download, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const navigationItems = [
  { path: "/", label: "Início", icon: Home },
  { path: "/anuncios", label: "Anúncios", icon: Search },
  { path: "/feed", label: "Feed", icon: Menu },
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

  const authItems = session
    ? [
        {
          label: "Sair",
          icon: Menu,
          onClick: handleSignOut,
        },
      ]
    : [
        {
          path: "/login",
          label: "Entrar",
          icon: Menu,
        },
        {
          path: "/registro",
          label: "Criar conta",
          icon: Menu,
        },
      ];

  return {
    menuItems: navigationItems,
    authItems,
    handleNavigation,
    location,
  };
};