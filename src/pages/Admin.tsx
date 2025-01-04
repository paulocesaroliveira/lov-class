import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersManagement } from "@/components/admin/UsersManagement";
import { AdsManagement } from "@/components/admin/AdsManagement";
import { toast } from "sonner";
import { AlertCircle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Create a client
const queryClient = new QueryClient();

const AdminContent = () => {
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

  // Buscar contagem de usuários por papel
  const { data: userStats } = useQuery({
    queryKey: ["user-stats"],
    queryFn: async () => {
      const { data: users, error } = await supabase
        .from("profiles")
        .select("role");

      if (error) throw error;

      const stats = {
        clients: users.filter(user => user.role === "user").length,
        advertisers: users.filter(user => user.role === "advertiser").length
      };

      return stats;
    },
    enabled: isAdmin === true,
  });

  // Buscar anúncios pendentes de revisão
  const { data: pendingAds } = useQuery({
    queryKey: ["pending-ads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("advertisements")
        .select(`
          id,
          advertisement_reviews!inner (
            status
          )
        `)
        .eq("advertisement_reviews.status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: isAdmin === true,
  });

  useEffect(() => {
    if (!session) {
      navigate("/admin-login");
      return;
    }

    if (!isLoading && isAdmin === false) {
      toast.error("Você não tem permissão para acessar esta página");
      navigate("/admin-login");
    }
  }, [session, isAdmin, isLoading, navigate]);

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

  const getPendingAdsText = (count: number) => {
    if (count === 0) return "Nenhum anúncio pendente de revisão";
    if (count === 1) return "1 anúncio pendente de revisão";
    return `${count} anúncios pendentes de revisão`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <p className="text-muted-foreground">
          Gerencie usuários e anúncios do sistema
        </p>
        
        {/* User Stats */}
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-4 py-2">
            <Users className="h-4 w-4" />
            <span className="text-sm">
              Clientes: <strong>{userStats?.clients || 0}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-4 py-2">
            <Users className="h-4 w-4" />
            <span className="text-sm">
              Anunciantes: <strong>{userStats?.advertisers || 0}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end">
        {pendingAds && pendingAds.length > 0 && (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <Badge variant="secondary">
              {getPendingAdsText(pendingAds.length)}
            </Badge>
          </div>
        )}
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
    </div>
  );
};

const Admin = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminContent />
    </QueryClientProvider>
  );
};

export default Admin;