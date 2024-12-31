import { Image as ImageIcon, Video } from "lucide-react";
import { FeedPost } from "./types";

interface PostListProps {
  posts: FeedPost[];
}

export const PostList = ({ posts }: PostListProps) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <article key={post.id} className="glass-card p-4 space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">{post.profile.name}</span>
            <span className="text-sm text-muted-foreground">
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>
          {post.content && <p>{post.content}</p>}
          {post.feed_post_media && post.feed_post_media.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {post.feed_post_media.map((media) => (
                <div key={media.id} className="relative">
                  {media.media_type === "image" ? (
                    <img
                      src={media.media_url}
                      alt=""
                      className="rounded-lg w-full h-48 object-cover"
                    />
                  ) : (
                    <video
                      src={media.media_url}
                      controls
                      className="rounded-lg w-full h-48 object-cover"
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