import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, ChartBar, MessageSquareMore } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAdvertisementStats } from "@/hooks/useAdvertisement";

const Perfil = () => {
  const navigate = useNavigate();
  const [hasAd, setHasAd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [advertisementId, setAdvertisementId] = useState<string | null>(null);

  const {
    totalViews,
    monthlyViews,
    totalWhatsappClicks,
    monthlyWhatsappClicks,
  } = useAdvertisementStats(advertisementId);

  useEffect(() => {
    const checkExistingAd = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("Você precisa estar logado para acessar seu perfil");
          navigate("/login");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        if (!profile) {
          toast.error("Perfil não encontrado. Por favor, faça login novamente.");
          await supabase.auth.signOut();
          navigate("/login");
          return;
        }

        const { data: advertisements } = await supabase
          .from("advertisements")
          .select("id")
          .eq("profile_id", profile.id);

        if (advertisements && advertisements.length > 0) {
          setHasAd(true);
          setAdvertisementId(advertisements[0].id);
        }
      } catch (error) {
        console.error("Error checking advertisement:", error);
        toast.error("Erro ao carregar informações do perfil");
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingAd();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie seus anúncios e informações pessoais
        </p>
      </div>

      {hasAd && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartBar className="w-5 h-5 text-primary" />
              Estatísticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                <div className="p-2 rounded-full bg-primary/10">
                  <ChartBar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Visualizações do mês</p>
                  <p className="text-2xl font-bold">{monthlyViews || 0}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                <div className="p-2 rounded-full bg-primary/10">
                  <ChartBar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Visualizações total</p>
                  <p className="text-2xl font-bold">{totalViews || 0}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                <div className="p-2 rounded-full bg-whatsapp/10">
                  <MessageSquareMore className="h-4 w-4 text-whatsapp" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cliques WhatsApp do mês</p>
                  <p className="text-2xl font-bold">{monthlyWhatsappClicks || 0}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                <div className="p-2 rounded-full bg-whatsapp/10">
                  <MessageSquareMore className="h-4 w-4 text-whatsapp" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cliques WhatsApp total</p>
                  <p className="text-2xl font-bold">{totalWhatsappClicks || 0}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">Meu Anúncio</h2>
        
        {hasAd ? (
          <Button
            onClick={() => navigate(`/editar-anuncio/${advertisementId}`)}
            className="w-full sm:w-auto"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar Anúncio
          </Button>
        ) : (
          <Button
            onClick={() => navigate("/criar-anuncio")}
            className="w-full sm:w-auto"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Criar Anúncio
          </Button>
        )}
      </div>
    </div>
  );
};

export default Perfil;