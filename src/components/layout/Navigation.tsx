import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, MessageSquare, Heart, Download, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const navigationItems = [
  { path: "/", label: "Início", icon: Home },
  { path: "/anuncios", label: "Anúncios", icon: Search },
  { path: "/feed", label: "Feed", icon: Menu },
  { path: "/mensagens/lista", label: "Mensagens", icon: MessageSquare },
  { path: "/favoritos", label: "Favoritos", icon: Heart },
  { path: "/instalar", label: "Instalar App", icon: Download },
];

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const authItems = user
    ? [
        {
          label: "Sair",
          icon: Menu,
          onClick: signOut,
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