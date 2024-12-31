import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

type MediaViewerProps = {
  type: "image" | "video";
  url: string;
  isOpen: boolean;
  onClose: () => void;
};

export const MediaViewer = ({ type, url, isOpen, onClose }: MediaViewerProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh]">
        {type === "image" ? (
          <img
            src={url}
            alt="Mídia expandida"
            className="w-full h-full object-contain"
          />
        ) : (
          <video
            src={url}
            controls
            className="w-full h-full"
            autoPlay
          />
        )}
      </DialogContent>
    </Dialog>
  );
};