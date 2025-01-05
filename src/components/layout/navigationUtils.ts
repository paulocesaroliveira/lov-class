import { useAuth } from "@/hooks/useAuth";
import { Home, Newspaper, Heart, User, LogIn, UserPlus, LogOut } from "lucide-react";

export type MenuItem = {
  label: string;
  href: string;
  icon: any;
};

export const useNavigation = () => {
  const { session } = useAuth();

  const menuItems: MenuItem[] = [
    { label: "Início", href: "/", icon: Home },
    { label: "Anúncios", href: "/anuncios", icon: Newspaper },
    { label: "Feed", href: "/feed", icon: Newspaper },
    { label: "Favoritos", href: "/favoritos", icon: Heart },
    ...(session?.user
      ? [
          { label: "Perfil", href: "/perfil", icon: User },
          { label: "Sair", href: "/login", icon: LogOut },
        ]
      : [
          { label: "Entrar", href: "/login", icon: LogIn },
          { label: "Cadastre-se", href: "/registro", icon: UserPlus },
        ]),
  ];

  return { menuItems };
};