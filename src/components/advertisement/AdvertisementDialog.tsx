import { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AdvertisementDetails } from "./AdvertisementDetails";
import { supabase } from "@/integrations/supabase/client";

interface AdvertisementDialogProps {
  advertisement: any;
  onOpenChange: (open: boolean) => void;
  isAdminView?: boolean; // New prop to identify admin views
}

export const AdvertisementDialog = ({ 
  advertisement, 
  onOpenChange,
  isAdminView = false // Default to false for regular views
}: AdvertisementDialogProps) => {
  useEffect(() => {
    const recordView = async () => {
      if (!advertisement || isAdminView) return; // Skip if admin view

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

  if (!advertisement) return null;

  return (
    <Dialog open={!!advertisement} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <AdvertisementDetails advertisement={advertisement} />
      </DialogContent>
    </Dialog>
  );
};