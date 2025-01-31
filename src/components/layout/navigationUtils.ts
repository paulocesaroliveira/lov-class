import { useAuth } from "@/hooks/useAuth";
import { Home, Newspaper, Heart, User, LogIn, UserPlus } from "lucide-react";

export interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const useNavigation = () => {
  const { session } = useAuth();

  const menuItems: MenuItem[] = [
    { label: "Início", href: "/", icon: Home },
    { label: "Anúncios", href: "/anuncios", icon: Newspaper },
    { label: "Favoritos", href: "/favoritos", icon: Heart },
    ...(session?.user
      ? [{ label: "Perfil", href: "/perfil", icon: User }]
      : [
          { label: "Entrar", href: "/login", icon: LogIn },
          { label: "Cadastre-se", href: "/registro", icon: UserPlus },
        ]),
  ];

  return { menuItems };
};