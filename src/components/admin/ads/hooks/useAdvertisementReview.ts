import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdvertisementReview = (refetch: () => Promise<void>) => {
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  const handleReview = async (status: 'approved' | 'rejected') => {
    if (!selectedAd) return;

    try {
      console.log(`Iniciando revisão do anúncio ${selectedAd.id} com status ${status}`);
      
      // Primeiro atualiza o status do anúncio
      const { error: adError } = await supabase
        .from("advertisements")
        .update({ 
          status: status === 'approved' ? 'approved' : 'blocked'
        })
        .eq("id", selectedAd.id);

      if (adError) {
        console.error("Erro ao atualizar status do anúncio:", adError);
        throw adError;
      }

      console.log("Status do anúncio atualizado com sucesso");

      // Depois cria uma nova revisão
      const currentUser = (await supabase.auth.getUser()).data.user?.id;
      
      const { error: reviewError } = await supabase
        .from("advertisement_reviews")
        .insert({
          advertisement_id: selectedAd.id,
          status: status, // Aqui mantemos 'rejected' ou 'approved'
          reviewer_id: currentUser,
          review_notes: reviewNotes || `Anúncio ${status === 'approved' ? 'aprovado' : 'rejeitado'} pela administração`,
          block_reason: status === 'rejected' ? reviewNotes : null
        });

      if (reviewError) {
        console.error("Erro ao criar revisão:", reviewError);
        throw reviewError;
      }

      console.log("Revisão criada com sucesso");
      toast.success(`Anúncio ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso`);
      setSelectedAd(null);
      setReviewNotes("");
      await refetch();
    } catch (error) {
      console.error("Erro ao revisar anúncio:", error);
      toast.error("Erro ao revisar anúncio");
    }
  };

  return {
    selectedAd,
    setSelectedAd,
    reviewNotes,
    setReviewNotes,
    handleReview
  };
};