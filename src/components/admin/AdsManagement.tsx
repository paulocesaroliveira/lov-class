import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdsTable } from "./ads/AdsTable";
import { ReviewDialog } from "./ads/ReviewDialog";
import { AdvertisementDialog } from "@/components/advertisement/AdvertisementDialog";
import { useAdvertisementActions } from "./ads/hooks/useAdvertisementActions";
import { useAdvertisementReview } from "./ads/hooks/useAdvertisementReview";
import { ActionDialog } from "./ads/ActionDialog";
import { toast } from "sonner";

export const AdsManagement = () => {
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
          advertisement_reviews!inner (
            status,
            review_notes,
            updated_at
          )
        `)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      // Agrupar revisões por anúncio e pegar a mais recente
      const processedData = data?.map(ad => ({
        ...ad,
        advertisement_reviews: [ad.advertisement_reviews[ad.advertisement_reviews.length - 1]]
      }));

      return processedData;
    },
  });

  const {
    deleting,
    actionDialog,
    setActionDialog,
    handleDelete,
    handleBlock
  } = useAdvertisementActions(refetch);

  const {
    selectedAd,
    setSelectedAd,
    reviewNotes,
    setReviewNotes,
    handleReview
  } = useAdvertisementReview(refetch);

  const handleApprove = async (ad: any) => {
    try {
      // Primeiro, buscar a revisão mais recente
      const { data: reviews, error: fetchError } = await supabase
        .from("advertisement_reviews")
        .select("*")
        .eq("advertisement_id", ad.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;

      const reviewId = reviews?.[0]?.id;

      // Atualizar o status do anúncio para não bloqueado
      const { error: unblockError } = await supabase
        .from("advertisements")
        .update({ 
          blocked: false,
          block_reason: null
        })
        .eq("id", ad.id);

      if (unblockError) throw unblockError;

      if (reviewId) {
        // Se existe uma revisão, atualiza ela
        const { error: updateError } = await supabase
          .from("advertisement_reviews")
          .update({
            status: 'approved',
            reviewer_id: (await supabase.auth.getUser()).data.user?.id,
            updated_at: new Date().toISOString()
          })
          .eq("id", reviewId);

        if (updateError) throw updateError;
      } else {
        // Se não existe, cria uma nova
        const { error: insertError } = await supabase
          .from("advertisement_reviews")
          .insert({
            advertisement_id: ad.id,
            status: 'approved',
            reviewer_id: (await supabase.auth.getUser()).data.user?.id
          });

        if (insertError) throw insertError;
      }

      toast.success("Anúncio aprovado com sucesso");
      refetch();
    } catch (error) {
      console.error("Erro ao aprovar anúncio:", error);
      toast.error("Erro ao aprovar anúncio");
    }
  };

  return (
    <div className="space-y-4">
      <AdsTable
        advertisements={advertisements || []}
        onDelete={(id) => setActionDialog({ type: 'delete', adId: id, reason: "" })}
        onBlock={(id) => setActionDialog({ type: 'block', adId: id, reason: "" })}
        onView={setSelectedAd}
        onApprove={handleApprove}
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

      <AdvertisementDialog 
        advertisement={selectedAd} 
        onOpenChange={() => setSelectedAd(null)} 
      />

      <ActionDialog
        type={actionDialog.type}
        adId={actionDialog.adId}
        reason={actionDialog.reason}
        onReasonChange={(reason) => setActionDialog(prev => ({ ...prev, reason }))}
        onConfirm={() => {
          if (actionDialog.type === 'delete') {
            handleDelete(actionDialog.adId!, actionDialog.reason);
          } else {
            handleBlock(actionDialog.adId!, actionDialog.reason);
          }
        }}
        onCancel={() => setActionDialog({ type: null, adId: null, reason: "" })}
      />
    </div>
  );
};