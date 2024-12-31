import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreatePost } from "@/components/feed/CreatePost";
import { PostList } from "@/components/feed/PostList";
import { FeedPost } from "@/components/feed/types";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

const Feed = () => {
  const { session } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);

  // Check if user has an advertisement
  const { data: hasAdvertisement } = useQuery({
    queryKey: ["user-advertisement", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return false;

      const { count } = await supabase
        .from("advertisements")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", session.user.id);

      return count ? count > 0 : false;
    },
    enabled: !!session?.user?.id,
  });

  const fetchPosts = async () => {
    try {
      console.log("Fetching posts...");
      
      let query = supabase
        .from("feed_posts")
        .select(`
          id,
          content,
          created_at,
          profiles!inner (
            id,
            advertisements (
              name
            )
          ),
          feed_post_media (
            id,
            media_type,
            media_url
          )
        `)
        .order("created_at", { ascending: false });

      // Limit to 5 posts for logged out users
      if (!session) {
        query = query.limit(5);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }
      
      console.log("Raw data from Supabase:", data);

      // Transform the data to match our FeedPost type
      const typedPosts = (data || []).map(post => ({
        id: post.id,
        content: post.content,
        created_at: post.created_at,
        advertisement: post.profiles?.advertisements?.[0] || null,
        feed_post_media: post.feed_post_media.map(media => ({
          id: media.id,
          media_type: media.media_type as "image" | "video",
          media_url: media.media_url
        }))
      }));

      console.log("Transformed posts:", typedPosts);
      setPosts(typedPosts);
    } catch (error: any) {
      console.error("Error in fetchPosts:", error);
      toast.error("Erro ao carregar posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [session]); // Re-fetch when session changes

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Feed</h1>
        <p className="text-muted-foreground mt-2">
          {session 
            ? "Compartilhe suas novidades com outros usuários"
            : "Veja as últimas 5 publicações do feed. Faça login para ver mais!"
          }
        </p>
      </div>

      {session ? (
        hasAdvertisement ? (
          <CreatePost onPostCreated={fetchPosts} />
        ) : (
          <div className="glass-card p-4 text-center">
            <p className="text-muted-foreground">
              Para publicar no feed, você precisa ter um anúncio ativo.
            </p>
          </div>
        )
      ) : (
        <div className="glass-card p-4 text-center">
          <p className="text-muted-foreground">
            Faça login para publicar no feed e ver todas as publicações.
          </p>
        </div>
      )}

      <PostList posts={posts} />
    </div>
  );
};

export default Feed;