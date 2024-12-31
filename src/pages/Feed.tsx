import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreatePost } from "@/components/feed/CreatePost";
import { PostList } from "@/components/feed/PostList";
import { FeedPost } from "@/components/feed/types";

const Feed = () => {
  const [posts, setPosts] = useState<FeedPost[]>([]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("feed_posts")
        .select(`
          id,
          content,
          created_at,
          profiles!inner(
            advertisements(name)
          ),
          feed_post_media(id, media_type, media_url)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our FeedPost type
      const typedPosts = (data || []).map(post => ({
        ...post,
        advertisement: post.profiles?.advertisements?.[0] || null,
        feed_post_media: post.feed_post_media.map(media => ({
          ...media,
          media_type: media.media_type as "image" | "video"
        }))
      }));

      setPosts(typedPosts);
    } catch (error: any) {
      toast.error("Erro ao carregar posts");
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Feed</h1>
        <p className="text-muted-foreground mt-2">
          Compartilhe suas novidades com outros usuários
        </p>
      </div>

      <CreatePost onPostCreated={fetchPosts} />
      <PostList posts={posts} />
    </div>
  );
};

export default Feed;