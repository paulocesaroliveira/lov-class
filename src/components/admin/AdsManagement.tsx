import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AdsTable } from "./ads/AdsTable";
import { ReviewDialog } from "./ads/ReviewDialog";

export const AdsManagement = () => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  const { data: advertisements, refetch } = useQuery({
    queryKey: ["admin-advertisements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("advertisements")
        .select(`
          *,
          profiles (
            name,
            role
          ),
          advertisement_reviews (
            status,
            review_notes,
            updated_at
          )
        `)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      const { error } = await supabase
        .from("advertisements")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Anúncio excluído com sucesso");
      refetch();
    } catch (error) {
      console.error("Erro ao excluir anúncio:", error);
      toast.error("Erro ao excluir anúncio");
    } finally {
      setDeleting(null);
    }
  };

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

  return (
    <div className="space-y-4">
      <AdsTable
        advertisements={advertisements || []}
        onDelete={handleDelete}
        onView={(id) => navigate(`/anuncio/${id}`)}
        onReview={setSelectedAd}
        deleting={deleting}
      />

      <ReviewDialog
        selectedAd={selectedAd}
        reviewNotes={reviewNotes}
        setReviewNotes={setReviewNotes}
        onReview={handleReview}
        onClose={() => setSelectedAd(null)}
      />
    </div>
  );
};