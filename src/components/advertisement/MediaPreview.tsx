import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaPreview as MediaPreviewType } from "@/types/advertisement";

interface MediaPreviewProps {
  media: MediaPreviewType[];
  onDelete: (id: string) => void;
}

export const MediaPreview = ({ media, onDelete }: MediaPreviewProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {media.map((item) => (
        <div key={item.id} className="relative group">
          {item.type === 'photo' ? (
            <img
              src={item.url}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg"
            />
          ) : (
            <video
              src={item.url}
              className="w-full h-40 object-cover rounded-lg"
              controls
            />
          )}
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(item.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};