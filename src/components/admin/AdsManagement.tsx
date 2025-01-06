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
      // Update advertisement status
      const { error: adError } = await supabase
        .from("advertisements")
        .update({ 
          status: 'approved',
          blocked: false,
          block_reason: null
        })
        .eq("id", ad.id);

      if (adError) {
        console.error("Error updating advertisement:", adError);
        throw adError;
      }

      // Fetch the most recent review
      const { data: reviews, error: fetchError } = await supabase
        .from("advertisement_reviews")
        .select("*")
        .eq("advertisement_id", ad.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error("Error fetching reviews:", fetchError);
        throw fetchError;
      }

      const reviewId = reviews?.[0]?.id;
      const currentUser = (await supabase.auth.getUser()).data.user?.id;

      if (reviewId) {
        // Update existing review
        const { error: updateError } = await supabase
          .from("advertisement_reviews")
          .update({
            status: 'approved',
            reviewer_id: currentUser,
            updated_at: new Date().toISOString()
          })
          .eq("id", reviewId);

        if (updateError) {
          console.error("Error updating review:", updateError);
          throw updateError;
        }
      } else {
        // Create new review
        const { error: insertError } = await supabase
          .from("advertisement_reviews")
          .insert({
            advertisement_id: ad.id,
            status: 'approved',
            reviewer_id: currentUser
          });

        if (insertError) {
          console.error("Error creating review:", insertError);
          throw insertError;
        }
      }

      toast.success("Anúncio aprovado com sucesso");
      refetch();
    } catch (error) {
      console.error("Error in handleApprove:", error);
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