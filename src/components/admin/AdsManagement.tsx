import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AdsTable } from "./ads/AdsTable";
import { ReviewDialog } from "./ads/ReviewDialog";
import { AdvertisementDialog } from "@/components/advertisement/AdvertisementDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Define valid table names as a const array for type safety
const RELATED_TABLES = [
  'advertisement_whatsapp_clicks',
  'advertisement_views',
  'advertisement_videos',
  'advertisement_photos',
  'advertisement_services',
  'advertisement_service_locations',
  'advertisement_reviews',
  'advertisement_comments',
  'favorites'
] as const;

// Create a type from the array
type RelatedTable = typeof RELATED_TABLES[number];

type ActionDialogState = {
  type: 'delete' | 'block' | null;
  adId: string | null;
  reason: string;
};

export const AdsManagement = () => {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [actionDialog, setActionDialog] = useState<ActionDialogState>({
    type: null,
    adId: null,
    reason: "",
  });

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

  const handleDelete = async (id: string, reason: string) => {
    try {
      setDeleting(id);

      // Delete related records first
      for (const table of RELATED_TABLES) {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('advertisement_id', id);

        if (error) {
          console.error(`Erro ao excluir registros da tabela ${table}:`, error);
          throw error;
        }
      }

      // Finally delete the advertisement
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
      setActionDialog({ type: null, adId: null, reason: "" });
    }
  };

  const handleBlock = async (id: string, reason: string) => {
    try {
      const { error } = await supabase
        .from("advertisements")
        .update({ 
          blocked: true,
          block_reason: reason
        })
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Anúncio bloqueado com sucesso");
      refetch();
    } catch (error) {
      console.error("Erro ao bloquear anúncio:", error);
      toast.error("Erro ao bloquear anúncio");
    } finally {
      setActionDialog({ type: null, adId: null, reason: "" });
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
        onDelete={(id) => setActionDialog({ type: 'delete', adId: id, reason: "" })}
        onBlock={(id) => setActionDialog({ type: 'block', adId: id, reason: "" })}
        onView={setSelectedAd}
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

      <AlertDialog 
        open={actionDialog.type !== null}
        onOpenChange={(open) => !open && setActionDialog({ type: null, adId: null, reason: "" })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionDialog.type === 'delete' ? 'Excluir Anúncio' : 'Bloquear Anúncio'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog.type === 'delete' 
                ? 'Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.'
                : 'Tem certeza que deseja bloquear este anúncio? O anúncio não será mais visível para os usuários.'}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <Label htmlFor="reason">Motivo</Label>
            <Textarea
              id="reason"
              value={actionDialog.reason}
              onChange={(e) => setActionDialog(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Digite o motivo..."
              className="mt-2"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (actionDialog.type === 'delete') {
                  handleDelete(actionDialog.adId!, actionDialog.reason);
                } else {
                  handleBlock(actionDialog.adId!, actionDialog.reason);
                }
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};