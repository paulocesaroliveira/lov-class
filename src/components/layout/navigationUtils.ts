import { useAuth } from "@/hooks/useAuth";
import { Home, Newspaper, Heart, User, LogIn, UserPlus } from "lucide-react";

export type MenuItem = {
  label: string;
  href: string;
  icon: any;
};

export const useNavigation = () => {
  const { session } = useAuth();

  const menuItems: MenuItem[] = [
    { label: "Início", href: "/", icon: Home },
    { label: "Feed", href: "/feed", icon: Newspaper },
    { label: "Anúncios", href: "/anuncios", icon: Newspaper },
    ...(session?.user
      ? [
          { label: "Favoritos", href: "/favoritos", icon: Heart },
          { label: "Perfil", href: "/perfil", icon: User },
        ]
      : [
          { label: "Login", href: "/login", icon: LogIn },
          { label: "Registro", href: "/registro", icon: UserPlus },
        ]),
  ];

  return { menuItems };
};