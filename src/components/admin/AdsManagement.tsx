import { AdsTable } from "./ads/AdsTable";
import { ReviewDialog } from "./ads/ReviewDialog";
import { AdvertisementDialog } from "@/components/advertisement/AdvertisementDialog";
import { useAdvertisementActions } from "./ads/hooks/useAdvertisementActions";
import { useAdvertisementReview } from "./ads/hooks/useAdvertisementReview";
import { ActionDialog } from "./ads/ActionDialog";
import { useAdvertisements } from "./ads/hooks/useAdvertisements";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const AdsManagement = () => {
  const { data: advertisements, refetch } = useAdvertisements();

  // Create a wrapper function that returns void
  const handleRefetch = async () => {
    await refetch();
  };

  const {
    deleting,
    actionDialog,
    setActionDialog,
    handleDelete,
    handleBlock
  } = useAdvertisementActions(handleRefetch);

  const {
    selectedAd,
    setSelectedAd,
    reviewNotes,
    setReviewNotes,
    handleReview
  } = useAdvertisementReview(handleRefetch);

  const handleApprove = async (ad: any) => {
    try {
      console.log("Iniciando aprovação do anúncio:", ad.id);
      
      // Primeiro atualiza o status do anúncio
      const { error: adError } = await supabase
        .from("advertisements")
        .update({ 
          status: 'approved'
        })
        .eq("id", ad.id);

      if (adError) {
        console.error("Erro ao atualizar anúncio:", adError);
        throw adError;
      }

      console.log("Status do anúncio atualizado com sucesso");

      // Depois cria uma nova revisão
      const currentUser = (await supabase.auth.getUser()).data.user?.id;
      
      const { error: reviewError } = await supabase
        .from("advertisement_reviews")
        .insert({
          advertisement_id: ad.id,
          status: 'approved',
          reviewer_id: currentUser,
          review_notes: "Anúncio aprovado pela administração",
          block_reason: null
        });

      if (reviewError) {
        console.error("Erro ao criar revisão:", reviewError);
        throw reviewError;
      }

      console.log("Revisão criada com sucesso");
      toast.success("Anúncio aprovado com sucesso");
      await handleRefetch();
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
        isAdminView={true}
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