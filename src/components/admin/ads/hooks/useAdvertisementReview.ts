import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdvertisementReview = (refetch: () => void) => {
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  const handleReview = async (status: 'approved' | 'rejected') => {
    if (!selectedAd) return;

    try {
      const { error } = await supabase
        .from("advertisement_reviews")
        .insert({
          advertisement_id: selectedAd.id,
          status,
          review_notes: reviewNotes,
          reviewer_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast.success(`Anúncio ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso`);
      setSelectedAd(null);
      setReviewNotes("");
      refetch();
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