import { useAuth } from "@/hooks/useAuth";
import { Home, Newspaper, Heart, User, LogIn, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const useNavigation = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logout realizado com sucesso");
      navigate("/login");
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
      toast.error(error.message || "Erro ao fazer logout");
    }
  };

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

  return { menuItems, handleLogout };
};