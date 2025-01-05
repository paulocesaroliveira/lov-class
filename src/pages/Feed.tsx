import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatePost } from "@/components/feed/CreatePost";
import { PostList } from "@/components/feed/PostList";
import { useAuth } from "@/hooks/useAuth";

export const Feed = () => {
  const { session } = useAuth();

  const { data: posts = [], isLoading } = useQuery({
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

      return data;
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
      {session && <CreatePost />}
      <PostList posts={posts} />
    </div>
  );
};