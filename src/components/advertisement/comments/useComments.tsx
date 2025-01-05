import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useComments = (advertisementId: string) => {
  const { data: comments, refetch } = useQuery({
    queryKey: ["comments", advertisementId],
    queryFn: async () => {
      const { data: commentsData, error: commentsError } = await supabase
        .from("advertisement_comments")
        .select("*")
        .eq("advertisement_id", advertisementId)
        .order("created_at", { ascending: false });

      if (commentsError) throw commentsError;

      const userIds = [...new Set(commentsData.map(comment => comment.user_id))];

      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      const profileMap = new Map(profilesData.map(profile => [profile.id, profile.name]));

      return commentsData.map(comment => ({
        ...comment,
        user_name: profileMap.get(comment.user_id) || "Unknown User"
      }));
    },
  });

  const handleDelete = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from("advertisement_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      toast.success("Comentário removido com sucesso!");
      refetch();
    } catch (error) {
      toast.error("Erro ao remover comentário");
    }
  };

  const handleSubmit = async (userId: string, comment: string, rating: number | null) => {
    try {
      const { error } = await supabase
        .from("advertisement_comments")
        .insert({
          advertisement_id: advertisementId,
          user_id: userId,
          comment: comment.trim(),
          rating: rating,
        });

      if (error) throw error;

      toast.success("Comentário adicionado com sucesso!");
      refetch();
      return true;
    } catch (error) {
      toast.error("Erro ao adicionar comentário");
      return false;
    }
  };

  return {
    comments,
    handleDelete,
    handleSubmit,
  };
};