import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image as ImageIcon, Video } from "lucide-react";

interface FeedPost {
  id: string;
  content: string;
  created_at: string;
  profile: {
    name: string;
  };
  feed_post_media: {
    id: string;
    media_type: "image" | "video";
    media_url: string;
  }[];
}

const Feed = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate("/login", { state: { returnTo: "/feed", message: "Faça login para acessar o feed" } });
      return;
    }

    fetchPosts();
  }, [session, navigate]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("feed_posts")
        .select(`
          id,
          content,
          created_at,
          profile:profiles(name),
          feed_post_media(id, media_type, media_url)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar posts");
      console.error("Error fetching posts:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && media.length === 0) {
      toast.error("Adicione conteúdo ou mídia ao seu post");
      return;
    }

    setIsLoading(true);
    try {
      // Create post
      const { data: post, error: postError } = await supabase
        .from("feed_posts")
        .insert({ content, profile_id: session?.user.id })
        .select()
        .single();

      if (postError) throw postError;

      // Upload media files
      if (media.length > 0) {
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
      fetchPosts();
    } catch (error: any) {
      toast.error("Erro ao criar post");
      console.error("Error creating post:", error);
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Feed</h1>
        <p className="text-muted-foreground mt-2">
          Compartilhe suas novidades com outros usuários
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-4 space-y-4">
        <Textarea
          placeholder="O que você quer compartilhar?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px]"
        />
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
    </div>
  );
};

export default Feed;