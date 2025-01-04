import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminLogin = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["isAdmin", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return false;

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error checking admin role:", error);
        return false;
      }

      return data?.role === "admin";
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }

    if (!isLoading) {
      if (isAdmin) {
        navigate("/admin");
      } else {
        toast.error("Você não tem permissão para acessar esta página");
        navigate("/");
      }
    }
  }, [session, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return null;
};

export default AdminLogin;