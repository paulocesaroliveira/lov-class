import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type MediaViewerProps = {
  type: "image" | "video";
  url: string;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
};

export const MediaViewer = ({ 
  type, 
  url, 
  isOpen, 
  onClose,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious
}: MediaViewerProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-50 rounded-full bg-black/20 hover:bg-black/40 text-white"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="relative w-full h-full flex items-center justify-center">
          {type === "image" ? (
            <img
              src={url}
              alt="Mídia expandida"
              className="max-w-full max-h-[90vh] object-contain"
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

          {type === "image" && (
            <>
              {hasPrevious && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 rounded-full bg-black/20 hover:bg-black/40 text-white"
                  onClick={onPrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              )}
              
              {hasNext && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 rounded-full bg-black/20 hover:bg-black/40 text-white"
                  onClick={onNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};