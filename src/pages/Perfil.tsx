import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAdvertisementStats } from "@/hooks/useAdvertisement";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { AdvertisementSection } from "@/components/profile/AdvertisementSection";
import { PasswordChangeSection } from "@/components/profile/PasswordChangeSection";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";

interface Advertisement {
  id: string;
}

const Perfil = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading } = useAuthContext();
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    totalViews,
    monthlyViews,
    totalWhatsappClicks,
    monthlyWhatsappClicks,
  } = useAdvertisementStats(advertisement?.id || null);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        if (authLoading) return;

        if (!user) {
          console.log("Usuário não autenticado, redirecionando para login");
          toast.error("Você precisa estar logado para acessar seu perfil");
          navigate("/login");
          return;
        }

        console.log("Carregando dados do anúncio para o usuário:", user.id);
        const { data: advertisementData, error: adError } = await supabase
          .from("advertisements")
          .select("id")
          .eq("profile_id", user.id)
          .maybeSingle();

        if (adError) {
          console.error("Erro ao carregar anúncio:", adError);
          throw adError;
        }

        setAdvertisement(advertisementData);
      } catch (error: any) {
        console.error("Erro ao carregar dados do perfil:", error);
        toast.error("Erro ao carregar informações do perfil");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [user, authLoading, navigate]);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie seus anúncios e informações pessoais
          </p>
        </div>
        
        {isAdmin && (
          <Button
            onClick={() => navigate("/admin")}
            variant="outline"
            className="gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            Painel Administrativo
          </Button>
        )}
      </div>

      {advertisement && (
        <ProfileStats
          totalViews={totalViews}
          monthlyViews={monthlyViews}
          totalWhatsappClicks={totalWhatsappClicks}
          monthlyWhatsappClicks={monthlyWhatsappClicks}
        />
      )}

      <AdvertisementSection 
        hasAd={!!advertisement} 
        advertisementId={advertisement?.id || null} 
      />
      
      <PasswordChangeSection />
    </div>
  );
};

export default Perfil;