import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreatePost } from "@/components/feed/CreatePost";
import { PostList } from "@/components/feed/PostList";
import { FeedPost } from "@/components/feed/types";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

const POSTS_PER_PAGE = 10;

const Feed = () => {
  const { session } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  // Check if user is an advertiser or admin by checking user role in profiles table
  const { data: userRole } = useQuery({
    queryKey: ['user-role', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      return data?.role;
    },
    enabled: !!session?.user?.id,
  });

  const isAdvertiserOrAdmin = userRole === 'advertiser' || userRole === 'admin';
  const isAdmin = userRole === 'admin';

  const { data: postsData, refetch } = useQuery({
    queryKey: ['feed-posts', page, session?.user?.id],
    queryFn: async () => {
      try {
        console.log("Fetching posts for page:", page);
        
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
          .order("created_at", { ascending: false })
          .range(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE - 1);

        // Limit to first page only for logged out users
        if (!session) {
          query = query.range(0, POSTS_PER_PAGE - 1);
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

        setHasMore(typedPosts.length === POSTS_PER_PAGE);
        return typedPosts;
      } catch (error: any) {
        console.error("Error in fetchPosts:", error);
        toast.error("Erro ao carregar posts");
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  useEffect(() => {
    if (postsData) {
      if (page === 0) {
        setPosts(postsData);
      } else {
        setPosts(prev => [...prev, ...postsData]);
      }
    }
  }, [postsData, page]);

  useEffect(() => {
    if (inView && hasMore && session) {
      setPage(prev => prev + 1);
    }
  }, [inView, hasMore, session]);

  const handlePostCreated = () => {
    setPage(0);
    setPosts([]);
    refetch();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Feed</h1>
        <p className="text-muted-foreground mt-2">
          {session 
            ? "Compartilhe suas novidades com outros usuários"
            : "Veja as últimas publicações do feed. Faça login para ver mais!"
          }
        </p>
      </div>

      {session ? (
        isAdvertiserOrAdmin ? (
          <CreatePost onPostCreated={handlePostCreated} />
        ) : (
          <div className="glass-card p-4 text-center">
            <p className="text-muted-foreground">
              Apenas anunciantes podem publicar no feed.
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

      <PostList posts={posts} isAdmin={isAdmin} onPostDeleted={handlePostCreated} />
      
      {session && hasMore && (
        <div ref={ref} className="h-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default Feed;