import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdvertisementMedia } from "./AdvertisementMedia";
import { AdvertisementDetails } from "./AdvertisementDetails";

type AdvertisementDialogProps = {
  advertisement: any;
  onOpenChange: (open: boolean) => void;
};

export const AdvertisementDialog = ({ advertisement, onOpenChange }: AdvertisementDialogProps) => {
  if (!advertisement) return null;

  return (
    <Dialog open={!!advertisement} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{advertisement.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coluna da Esquerda - Mídia */}
          <AdvertisementMedia
            profilePhotoUrl={advertisement.profile_photo_url}
            photos={advertisement.advertisement_photos}
            videos={advertisement.advertisement_videos}
            name={advertisement.name}
          />

          {/* Coluna da Direita - Informações */}
          <AdvertisementDetails advertisement={advertisement} />
        </div>
      </DialogContent>
    </Dialog>
  );
};