import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatePost } from "@/components/feed/CreatePost";
import { PostList } from "@/components/feed/PostList";
import { useAuth } from "@/hooks/useAuth";
import { FeedPost } from "@/components/feed/types";

const Feed = () => {
  const { session } = useAuth();

  const { data: posts = [], isLoading, refetch } = useQuery({
    queryKey: ["feed-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feed_posts")
        .select(`
          id,
          content,
          created_at,
          profile_id,
          profiles (
            name
          ),
          feed_post_media (
            id,
            media_type,
            media_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }

      return data.map((post): FeedPost => ({
        id: post.id,
        content: post.content,
        created_at: post.created_at,
        advertisement: post.profiles ? { name: post.profiles.name } : null,
        feed_post_media: post.feed_post_media.map(media => ({
          id: media.id,
          media_type: media.media_type as "image" | "video",
          media_url: media.media_url
        }))
      }));
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-black/20 animate-pulse rounded-lg h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {session && <CreatePost onPostCreated={refetch} />}
      <PostList posts={posts} onPostDeleted={refetch} />
    </div>
  );
};

export default Feed;