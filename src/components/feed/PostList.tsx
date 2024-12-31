import { Image as ImageIcon, Video } from "lucide-react";
import { FeedPost } from "./types";
import { format } from "date-fns";

interface PostListProps {
  posts: FeedPost[];
}

export const PostList = ({ posts }: PostListProps) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <article key={post.id} className="glass-card p-4 space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">{post.advertisement?.name || "Usuário anônimo"}</span>
            <span className="text-sm text-muted-foreground">
              {format(new Date(post.created_at), "dd/MM/yyyy 'às' HH:mm")}
            </span>
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