import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Smile } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import EmojiPicker from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface CreatePostProps {
  onPostCreated: () => void;
}

export const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const { session } = useAuth();
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDailyLimitError, setShowDailyLimitError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowDailyLimitError(false);

    if (!session) {
      toast.error("Faça login para criar um post");
      return;
    }

    if (!content.trim() && media.length === 0) {
      toast.error("Adicione conteúdo ou mídia ao seu post");
      return;
    }

    setIsLoading(true);
    try {
      // Try to create the post first
      const { data: post, error: postError } = await supabase
        .from("feed_posts")
        .insert([{ content, profile_id: session.user.id }])
        .select()
        .single();

      // Handle the daily limit error specifically
      if (postError) {
        if (postError.message.includes("Você só pode fazer uma publicação por dia")) {
          setShowDailyLimitError(true);
          setIsLoading(false);
          return;
        }
        throw postError;
      }

      // Only proceed with media upload if post was created successfully
      if (post && media.length > 0) {
        const mediaUploads = await Promise.all(
          media.map(async (file) => {
            const fileExt = file.name.split(".").pop();
            const fileName = `${post.id}/${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
              .from("feed_media")
              .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: mediaData } = await supabase.storage
              .from("feed_media")
              .getPublicUrl(fileName);

            return {
              post_id: post.id,
              media_type: file.type.startsWith("image/") ? "image" : "video",
              media_url: mediaData.publicUrl,
            };
          })
        );

        const { error: mediaError } = await supabase
          .from("feed_post_media")
          .insert(mediaUploads);

        if (mediaError) throw mediaError;
      }

      toast.success("Post criado com sucesso!");
      setContent("");
      setMedia([]);
      onPostCreated();
    } catch (error: any) {
      console.error("Error creating post:", error);
      toast.error("Erro ao criar post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      (file) =>
        file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    if (validFiles.length !== files.length) {
      toast.error("Apenas imagens e vídeos são permitidos");
    }

    setMedia(validFiles);
  };

  const onEmojiClick = (emojiObject: any) => {
    setContent((prevContent) => prevContent + emojiObject.emoji);
  };

  return (
    <div className="space-y-4">
      {showDailyLimitError && (
        <Alert variant="destructive">
          <AlertTitle>Limite Diário Atingido</AlertTitle>
          <AlertDescription>
            Você já fez uma publicação hoje. Para manter a qualidade do feed, 
            limitamos a uma publicação por dia. Tente novamente amanhã!
          </AlertDescription>
        </Alert>
      )}
      
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
          <div className="flex-1">
            <input
              type="file"
              id="media"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={handleMediaChange}
            />
            <label
              htmlFor="media"
              className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground"
            >
              <Upload size={20} />
              {media.length > 0
                ? `${media.length} arquivo(s) selecionado(s)`
                : "Adicionar mídia"}
            </label>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Publicando..." : "Publicar"}
          </Button>
        </div>
      </form>
    </div>
  );
};