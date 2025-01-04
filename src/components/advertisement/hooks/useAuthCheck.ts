import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useAuthCheck = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao verificar sessão:", error);
          toast.error("Erro ao verificar autenticação");
          navigate("/login");
          return;
        }

        if (!session) {
          toast.error("Você precisa estar logado para criar um anúncio");
          navigate("/login");
          return;
        }

        console.log("Usuário autenticado:", session.user.id);
        setUser(session.user);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        toast.error("Erro ao verificar autenticação");
        navigate("/login");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { user };
};