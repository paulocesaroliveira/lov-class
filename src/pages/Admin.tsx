import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersManagement } from "@/components/admin/UsersManagement";
import { AdsManagement } from "@/components/admin/AdsManagement";
import { toast } from "sonner";

const Admin = () => {
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
      
      console.log("Admin check result:", data); // Log para debug
      return data?.role === "admin";
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    console.log("Session:", session); // Log para debug
    console.log("isAdmin:", isAdmin); // Log para debug
    console.log("isLoading:", isLoading); // Log para debug

    // Se não estiver logado, redireciona para login administrativo
    if (!session) {
      navigate("/admin-login", { 
        state: { 
          message: "Você precisa fazer login como administrador para acessar esta página" 
        } 
      });
      return;
    }

    // Se estiver carregando, não faz nada
    if (isLoading) return;

    // Se não for admin, redireciona para login administrativo
    if (isAdmin === false) {
      toast.error("Você não tem permissão para acessar esta página");
      navigate("/admin-login");
      return;
    }
  }, [session, isAdmin, isLoading, navigate]);

  // Mostra loading enquanto verifica o status de admin
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // Se não for admin, não renderiza nada
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <p className="text-muted-foreground">
          Gerencie usuários e anúncios do sistema
        </p>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="ads">Anúncios</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-6">
          <UsersManagement />
        </TabsContent>
        <TabsContent value="ads" className="mt-6">
          <AdsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;