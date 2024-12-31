import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Star, StarOff, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type AdvertisementCommentsProps = {
  advertisementId: string;
};

export const AdvertisementComments = ({ advertisementId }: AdvertisementCommentsProps) => {
  const { session } = useAuth();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // First, fetch comments
  const { data: comments, refetch } = useQuery({
    queryKey: ["comments", advertisementId],
    queryFn: async () => {
      // Get comments
      const { data: commentsData, error: commentsError } = await supabase
        .from("advertisement_comments")
        .select("*")
        .eq("advertisement_id", advertisementId)
        .order("created_at", { ascending: false });

      if (commentsError) throw commentsError;

      // Get unique user IDs from comments
      const userIds = [...new Set(commentsData.map(comment => comment.user_id))];

      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      // Create a map of user IDs to names
      const profileMap = new Map(profilesData.map(profile => [profile.id, profile.name]));

      // Combine comments with profile names
      return commentsData.map(comment => ({
        ...comment,
        user_name: profileMap.get(comment.user_id) || "Unknown User"
      }));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Faça login para comentar");
      return;
    }
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("advertisement_comments")
        .insert({
          advertisement_id: advertisementId,
          user_id: session.user.id,
          comment: comment.trim(),
          rating: rating,
        });

      if (error) throw error;

      toast.success("Comentário adicionado com sucesso!");
      setComment("");
      setRating(null);
      refetch();
    } catch (error) {
      toast.error("Erro ao adicionar comentário");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, index) => (
          index < rating ? (
            <Star key={index} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ) : (
            <StarOff key={index} className="w-4 h-4 text-muted-foreground" />
          )
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        Comentários
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder={session ? "Escreva seu comentário..." : "Faça login para comentar"}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={!session || isSubmitting}
          className="min-h-[80px]"
        />
        
        {session && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Avaliação:</label>
            <RadioGroup
              value={rating?.toString()}
              onValueChange={(value) => setRating(parseInt(value))}
              className="flex gap-4"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value.toString()} id={`rating-${value}`} />
                  <label htmlFor={`rating-${value}`} className="text-sm">
                    {value} {value === 1 ? 'estrela' : 'estrelas'}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {session && (
          <Button
            type="submit"
            disabled={!comment.trim() || isSubmitting}
            className="w-full"
          >
            Enviar Comentário
          </Button>
        )}
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments?.map((comment: any) => (
          <div key={comment.id} className="bg-muted p-3 rounded-lg space-y-2">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="font-medium">{comment.user_name}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(comment.created_at), "dd/MM/yyyy HH:mm")}
                </p>
                {renderStars(comment.rating)}
              </div>
              {session?.user.id === comment.user_id && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(comment.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-sm">{comment.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};