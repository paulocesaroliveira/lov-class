import { useAuth } from "@/hooks/useAuth";
import { Home, Newspaper, Heart, User, LogIn, UserPlus, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type MenuItem = {
  label: string;
  href: string;
  icon: any;
  onClick?: () => void;
};

export const useNavigation = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Logout realizado com sucesso");
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  const menuItems: MenuItem[] = [
    { label: "Início", href: "/", icon: Home },
    { label: "Anúncios", href: "/anuncios", icon: Newspaper },
    { label: "Feed", href: "/feed", icon: Newspaper },
    { label: "Favoritos", href: "/favoritos", icon: Heart },
    ...(session?.user
      ? [
          { label: "Perfil", href: "/perfil", icon: User },
          { 
            label: "Sair", 
            href: "#", 
            icon: LogOut,
            onClick: handleLogout 
          },
        ]
      : [
          { label: "Entrar", href: "/login", icon: LogIn },
          { label: "Cadastre-se", href: "/registro", icon: UserPlus },
        ]),
  ];

  return { menuItems };
};