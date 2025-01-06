import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdvertisementReview = (refetch: () => Promise<void>) => {
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  const handleReview = async (status: 'approved' | 'rejected') => {
    if (!selectedAd) return;

    try {
      // Primeiro atualiza o status do anúncio
      const { error: adError } = await supabase
        .from("advertisements")
        .update({ 
          status: status === 'approved' ? 'approved' : 'blocked',
          blocked: status !== 'approved',
          block_reason: status === 'rejected' ? reviewNotes : null
        })
        .eq("id", selectedAd.id);

      if (adError) throw adError;

      // Depois cria uma nova revisão
      const { error: reviewError } = await supabase
        .from("advertisement_reviews")
        .insert({
          advertisement_id: selectedAd.id,
          status,
          review_notes: reviewNotes,
          reviewer_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (reviewError) throw reviewError;

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