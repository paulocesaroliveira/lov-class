import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ActionDialogState = {
  type: 'delete' | 'block' | null;
  adId: string | null;
  reason: string;
};

export const useAdvertisementActions = (refetch: () => void) => {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [actionDialog, setActionDialog] = useState<ActionDialogState>({
    type: null,
    adId: null,
    reason: "",
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

  return {
    deleting,
    actionDialog,
    setActionDialog,
    handleDelete,
    handleBlock
  };
};

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