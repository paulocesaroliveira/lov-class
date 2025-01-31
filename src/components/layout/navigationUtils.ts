import { useAuth } from "@/hooks/useAuth";
import { Home, Newspaper, Heart, User, LogIn, UserPlus, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MenuItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}

export const useNavigation = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log("Iniciando processo de logout...");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Erro ao fazer logout:", error);
        throw error;
      }
      
      console.log("Logout realizado com sucesso");
      toast.success("Logout realizado com sucesso");
      navigate("/login");
    } catch (error: any) {
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