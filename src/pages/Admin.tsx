import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersManagement } from "@/components/admin/UsersManagement";
import { AdsManagement } from "@/components/admin/AdsManagement";
import { Dashboard } from "@/components/admin/Dashboard";
import { Toaster } from "@/components/ui/sonner";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Admin = () => {
  const { isAdmin, isLoading, userId } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !userId) {
      toast.error("Você precisa estar logado para acessar esta página");
      navigate("/login");
      return;
    }

    if (!isLoading && !isAdmin) {
      toast.error("Você não tem permissão para acessar esta página");
      navigate("/");
    }
  }, [isAdmin, isLoading, userId, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
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

      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="ads">Anúncios</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="mt-6">
          <Dashboard />
        </TabsContent>
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