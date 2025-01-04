import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAdvertisementStats } from "@/hooks/useAdvertisement";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { AdvertisementSection } from "@/components/profile/AdvertisementSection";
import { PasswordChangeSection } from "@/components/profile/PasswordChangeSection";
import { useAuth } from "@/hooks/useAuth";

const Perfil = () => {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
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
    const checkAuth = async () => {
      if (authLoading) return;

      if (!session?.user) {
        toast.error("Você precisa estar logado para acessar seu perfil");
        navigate("/login", { state: { returnTo: "/perfil" } });
        return;
      }

      try {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profile) {
          toast.error("Perfil não encontrado");
          await supabase.auth.signOut();
          navigate("/login");
          return;
        }

        const { data: advertisements, error: adError } = await supabase
          .from("advertisements")
          .select("id")
          .eq("profile_id", profile.id);

        if (adError) throw adError;

        if (advertisements && advertisements.length > 0) {
          setHasAd(true);
          setAdvertisementId(advertisements[0].id);
        }
      } catch (error: any) {
        console.error("Error checking profile:", error);
        toast.error("Erro ao carregar informações do perfil");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [session, authLoading, navigate]);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie seus anúncios e informações pessoais
        </p>
      </div>

      {hasAd && (
        <ProfileStats
          totalViews={totalViews}
          monthlyViews={monthlyViews}
          totalWhatsappClicks={totalWhatsappClicks}
          monthlyWhatsappClicks={monthlyWhatsappClicks}
        />
      )}

      <AdvertisementSection hasAd={hasAd} advertisementId={advertisementId} />
      
      <PasswordChangeSection />
    </div>
  );
};

export default Perfil;