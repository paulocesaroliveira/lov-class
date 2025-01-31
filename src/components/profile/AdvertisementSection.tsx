import { PlusCircle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AdvertisementSectionProps {
  hasAd: boolean;
  advertisementId: string | null;
}

export const AdvertisementSection = ({ hasAd, advertisementId }: AdvertisementSectionProps) => {
  const navigate = useNavigate();

  const { data: advertisement, isLoading } = useQuery({
    queryKey: ['advertisement', advertisementId],
    queryFn: async () => {
      if (!advertisementId) return null;
      
      const { data, error } = await supabase
        .from("advertisements")
        .select("*")
        .eq("id", advertisementId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!advertisementId,
  });

  if (isLoading) {
    return (
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">Meu Anúncio</h2>
        <div className="animate-pulse h-10 bg-muted rounded" />
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-4">Meu Anúncio</h2>
      
      {hasAd ? (
        <div className="space-y-4">
          {advertisement && (
            <div className="text-sm text-muted-foreground mb-4">
              Status: {advertisement.moderation_status === 'pending_review' ? 'Em análise' : 'Aprovado'}
            </div>
          )}
          <Button
            onClick={() => navigate(`/editar-anuncio/${advertisementId}`)}
            className="w-full sm:w-auto"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar Anúncio
          </Button>
        </div>
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
  );
};