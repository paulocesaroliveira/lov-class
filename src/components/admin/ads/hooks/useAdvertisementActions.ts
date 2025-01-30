import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAdminRateLimit } from "../../hooks/useAdminRateLimit";

type ActionDialogState = {
  type: 'delete' | 'block' | null;
  adId: string | null;
  reason: string;
};

export const useAdvertisementActions = (refetch: () => Promise<void>) => {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [actionDialog, setActionDialog] = useState<ActionDialogState>({
    type: null,
    adId: null,
    reason: "",
  });
  const { checkRateLimit } = useAdminRateLimit();

  const handleDelete = async (id: string, reason: string) => {
    try {
      const canProceed = await checkRateLimit('delete_advertisement');
      if (!canProceed) return;

      setDeleting(id);
      console.log("Iniciando exclusão do anúncio:", id);

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
      
      console.log("Anúncio excluído com sucesso");
      toast.success("Anúncio excluído com sucesso");
      await refetch();
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
      const canProceed = await checkRateLimit('block_advertisement');
      if (!canProceed) return;

      console.log("Iniciando bloqueio do anúncio:", id);

      // First update the advertisement status
      const { error: blockError } = await supabase
        .from("advertisements")
        .update({ 
          moderation_status: 'blocked'
        })
        .eq("id", id);

      if (blockError) {
        console.error("Erro ao bloquear anúncio:", blockError);
        throw blockError;
      }

      console.log("Status do anúncio atualizado para bloqueado");

      // Then create a new review with rejected status and block reason
      const currentUser = (await supabase.auth.getUser()).data.user?.id;
      
      const { error: reviewError } = await supabase
        .from("advertisement_reviews")
        .insert({
          advertisement_id: id,
          moderation_status: 'rejected',
          reviewer_id: currentUser,
          review_notes: reason,
          block_reason: reason
        });

      if (reviewError) {
        console.error("Erro ao criar revisão:", reviewError);
        throw reviewError;
      }

      console.log("Revisão criada com sucesso");
      toast.success("Anúncio bloqueado com sucesso");
      await refetch();
    } catch (error) {
      console.error("Erro ao bloquear anúncio:", error);
      toast.error("Erro ao bloquear anúncio");
    } finally {
      setActionDialog({ type: null, adId: null, reason: "" });
    }
  };

  return {
    deleting,
    actionDialog,
    setActionDialog,
    handleDelete,
    handleBlock
  };
};

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