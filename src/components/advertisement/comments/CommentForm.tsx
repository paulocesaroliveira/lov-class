import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, StarOff } from "lucide-react";

interface CommentFormProps {
  isSubmitting: boolean;
  onSubmit: (comment: string, rating: number | null) => Promise<void>;
  session: any;
}

export const CommentForm = ({ isSubmitting, onSubmit, session }: CommentFormProps) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await onSubmit(comment, rating);
    setComment("");
    setRating(null);
  };

  const handleStarClick = (value: number) => {
    setRating(rating === value ? null : value);
  };

  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => {
          const isActive = (hoveredRating || rating || 0) >= value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => handleStarClick(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(null)}
              className={`cursor-pointer transition-transform hover:scale-110 ${
                isActive ? "text-yellow-400" : "text-muted-foreground"
              }`}
              disabled={isSubmitting}
            >
              {isActive ? (
                <Star className="w-6 h-6 fill-current" />
              ) : (
                <StarOff className="w-6 h-6" />
              )}
            </button>
          );
        })}
        {rating && (
          <span className="ml-2 text-sm text-muted-foreground">
            {rating} {rating === 1 ? "estrela" : "estrelas"}
          </span>
        )}
      </div>
    );
  };

  return (
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
          <label className="text-sm font-medium block mb-2">Avaliação:</label>
          {renderStars()}
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
  );
};