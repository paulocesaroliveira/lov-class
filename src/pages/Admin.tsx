import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersManagement } from "@/components/admin/UsersManagement";
import { AdsManagement } from "@/components/admin/AdsManagement";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const Admin = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["isAdmin", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        console.log("No session found, redirecting to login");
        return false;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error checking admin role:", error);
        toast.error("Erro ao verificar permissões de administrador");
        return false;
      }

      console.log("Admin check data:", data);
      return data?.role === "admin";
    },
    enabled: !!session?.user?.id,
    retry: false,
    staleTime: 30000, // Cache por 30 segundos
  });

  useEffect(() => {
    if (!session) {
      console.log("No session, redirecting to login");
      toast.error("Você precisa estar logado para acessar esta página");
      navigate("/login");
      return;
    }

    if (!isLoading && !isAdmin) {
      console.log("Access denied - User role:", isAdmin);
      toast.error("Você não tem permissão para acessar esta página");
      navigate("/");
    }
  }, [session, isAdmin, isLoading, navigate]);

  // Adicionando verificação extra para garantir que o usuário é admin
  if (!session || !isAdmin) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <p className="text-muted-foreground">
          Gerencie usuários e anúncios do sistema
        </p>
      </div>

      <Tabs defaultValue="ads">
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
      <Toaster />
    </div>
  );
};

export default Admin;