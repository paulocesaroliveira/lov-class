import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
        <div className="relative w-full h-full">
          <AspectRatio ratio={type === "image" ? 4/3 : 16/9} className="bg-black">
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
                controlsList="nodownload"
                playsInline
              />
            )}
          </AspectRatio>
        </div>
      </DialogContent>
    </Dialog>
  );
};