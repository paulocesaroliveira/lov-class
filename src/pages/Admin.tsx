import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersManagement } from "@/components/admin/UsersManagement";
import { AdsManagement } from "@/components/admin/AdsManagement";
import { Toaster } from "@/components/ui/sonner";
import { useAdminGuard } from "@/hooks/useAdminGuard";

const Admin = () => {
  const { isLoading, isAdmin } = useAdminGuard();

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