import { Dialog, DialogContent } from "@/components/ui/dialog";

type MediaViewerProps = {
  type: "image" | "video";
  url: string;
  isOpen: boolean;
  onClose: () => void;
};

export const MediaViewer = ({ type, url, isOpen, onClose }: MediaViewerProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
        <div className="relative w-full h-full flex items-center justify-center">
          {type === "image" ? (
            <img
              src={url}
              alt="Mídia expandida"
              className="max-w-full max-h-[80vh] object-contain"
            />
          ) : (
            <video
              src={url}
              controls
              className="w-full h-full"
              autoPlay
              controlsList="nodownload"
              playsInline
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};