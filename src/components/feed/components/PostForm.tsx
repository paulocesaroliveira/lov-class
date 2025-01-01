import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Smile } from "lucide-react";
import { toast } from "sonner";
import EmojiPicker from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MediaUploadButton } from "./MediaUploadButton";

interface PostFormProps {
  onSubmit: (content: string, media: File[]) => Promise<void>;
  isLoading: boolean;
}

export const PostForm = ({ onSubmit, isLoading }: PostFormProps) => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File[]>([]);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    if (validFiles.length !== files.length) {
      toast.error("Apenas imagens e vídeos são permitidos");
    }

    setMedia(validFiles);
  };

  const onEmojiClick = (emojiObject: any) => {
    setContent((prevContent) => prevContent + emojiObject.emoji);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && media.length === 0) {
      toast.error("Adicione conteúdo ou mídia ao seu post");
      return;
    }

    await onSubmit(content, media);
    setContent("");
    setMedia([]);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-4 space-y-4">
      <div className="relative">
        <Textarea
          placeholder="O que você quer compartilhar?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="absolute bottom-2 right-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <Smile className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="end">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <MediaUploadButton mediaCount={media.length} onChange={handleMediaChange} />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Publicando..." : "Publicar"}
        </Button>
      </div>
    </form>
  );
};