import { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AdvertisementDetails } from "./AdvertisementDetails";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdvertisementDialogProps {
  advertisement: any;
  onOpenChange: (open: boolean) => void;
  isAdminView?: boolean;
}

export const AdvertisementDialog = ({ 
  advertisement, 
  onOpenChange,
  isAdminView = false
}: AdvertisementDialogProps) => {
  useEffect(() => {
    const recordView = async () => {
      if (!advertisement || isAdminView) return;

      try {
        const { error } = await supabase
          .from("advertisement_views")
          .insert({ advertisement_id: advertisement.id });

        if (error) throw error;
      } catch (error) {
        console.error("Error recording view:", error);
      }
    };

    recordView();
  }, [advertisement, isAdminView]);

  const handleWhatsAppClick = async () => {
    if (!advertisement) return;

    try {
      const { error } = await supabase
        .from("advertisement_whatsapp_clicks")
        .insert({ advertisement_id: advertisement.id });

      if (error) throw error;

      // Open WhatsApp with the advertisement's phone number
      const whatsappUrl = `https://wa.me/${advertisement.whatsapp}`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error("Error recording WhatsApp click:", error);
      toast.error("Erro ao abrir WhatsApp");
    }
  };

  if (!advertisement) return null;

  return (
    <Dialog open={!!advertisement} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <AdvertisementDetails 
          advertisement={advertisement} 
          onWhatsAppClick={handleWhatsAppClick}
        />
      </DialogContent>
    </Dialog>
  );
};