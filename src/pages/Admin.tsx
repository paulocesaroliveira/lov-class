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
      if (!session?.user?.id) {
        console.log("No user session found");
        return false;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error checking admin role:", error);
          return false;
        }

        console.log("Profile data:", data);
        return data?.role === "admin";
      } catch (error) {
        console.error("Error in admin check:", error);
        return false;
      }
    },
    enabled: !!session?.user?.id,
    retry: false,
  });

  useEffect(() => {
    console.log("Current session:", session);
    console.log("Is admin:", isAdmin);
    console.log("Is loading:", isLoading);

    if (!session) {
      console.log("No session, redirecting to admin login");
      navigate("/admin-login");
      return;
    }

    if (!isLoading && isAdmin === false) {
      console.log("Not admin, redirecting to admin login");
      toast.error("Você não tem permissão para acessar esta página");
      navigate("/admin-login");
      return;
    }
  }, [session, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

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