import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const usePostCreation = (onSuccess: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDailyLimitError, setShowDailyLimitError] = useState(false);

  const createPost = async (content: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from("feed_posts")
        .insert({ content: content.trim(), profile_id: userId })
        .select()
        .maybeSingle();

      if (error) {
        console.log("Error creating post:", error);
        
        // Check if it's the daily limit error from the database trigger
        if (error.code === "P0001" && error.message?.includes("Você só pode fazer uma publicação por dia")) {
          setShowDailyLimitError(true);
          throw new Error("DAILY_LIMIT");
        }
        
        throw error;
      }

      if (!data) {
        throw new Error("NO_DATA");
      }

      return data;
    } catch (error: any) {
      if (error.message === "DAILY_LIMIT") {
        throw error;
      }
      console.error("Error creating post:", error);
      throw new Error("Failed to create post");
    }
  };

  const uploadMedia = async (file: File, postId: string) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${postId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("feed_media")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: mediaData } = await supabase.storage
        .from("feed_media")
        .getPublicUrl(fileName);

      const { error: mediaError } = await supabase
        .from("feed_post_media")
        .insert({
          post_id: postId,
          media_type: file.type.startsWith("image/") ? "image" : "video",
          media_url: mediaData.publicUrl,
        });

      if (mediaError) throw mediaError;
    } catch (error) {
      console.error("Error uploading media:", error);
      throw error;
    }
  };

  const handlePostCreation = async (content: string, media: File[], userId: string) => {
    setIsLoading(true);
    setShowDailyLimitError(false);

    try {
      const post = await createPost(content, userId);

      if (media.length > 0) {
        await Promise.all(media.map(file => uploadMedia(file, post.id)));
      }

      toast.success("Post criado com sucesso!");
      onSuccess();
      return true;
    } catch (error: any) {
      if (error.message === "DAILY_LIMIT") {
        toast.error("Você já fez uma publicação hoje. Tente novamente amanhã!");
      } else {
        console.error("Error in handlePostCreation:", error);
        toast.error("Erro ao criar post");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    showDailyLimitError,
    handlePostCreation,
  };
};