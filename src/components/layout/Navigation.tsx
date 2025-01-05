import { useAuth } from "@/hooks/useAuth";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";
import { Home, Newspaper, Heart, User, LogIn, UserPlus } from "lucide-react";
import { useState, useCallback } from "react";

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

export const Navigation = () => {
  const { menuItems } = useNavigation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClose = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <DesktopMenu menuItems={menuItems} />
          <MobileMenu 
            menuItems={menuItems} 
            isOpen={isMenuOpen} 
            onClose={handleClose}
          />
        </div>
      </div>
    </nav>
  );
};