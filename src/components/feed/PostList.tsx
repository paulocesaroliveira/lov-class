import { Image as ImageIcon, Video, Trash2 } from "lucide-react";
import { FeedPost } from "./types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PostListProps {
  posts: FeedPost[];
  isAdmin?: boolean;
  onPostDeleted: () => void;
}

export const PostList = ({ posts, isAdmin, onPostDeleted }: PostListProps) => {
  const handleDelete = async (postId: string) => {
    try {
      const { error } = await supabase
        .from("feed_posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;

      toast.success("Post excluído com sucesso");
      onPostDeleted();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Erro ao excluir post");
    }
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <article key={post.id} className="glass-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">{post.advertisement?.name || "Usuário anônimo"}</span>
              <span className="text-sm text-muted-foreground">
                {format(new Date(post.created_at), "dd/MM/yyyy 'às' HH:mm")}
              </span>
            </div>
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive/90"
                onClick={() => handleDelete(post.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          {post.content && <p>{post.content}</p>}
          {post.feed_post_media && post.feed_post_media.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {post.feed_post_media.map((media) => (
                <div key={media.id} className="relative w-full">
                  {media.media_type === "image" ? (
                    <img
                      src={media.media_url}
                      alt=""
                      className="rounded-lg w-full object-contain max-h-[600px]"
                    />
                  ) : (
                    <video
                      src={media.media_url}
                      controls
                      className="rounded-lg w-full"
                    />
                  )}
                  <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                    {media.media_type === "image" ? (
                      <ImageIcon size={16} className="text-white" />
                    ) : (
                      <Video size={16} className="text-white" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
};