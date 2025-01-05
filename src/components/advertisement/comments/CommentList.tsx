import { format } from "date-fns";
import { Star, StarOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Comment {
  id: string;
  user_name: string;
  created_at: string;
  rating: number | null;
  comment: string;
  user_id: string;
}

interface CommentListProps {
  comments: Comment[];
  currentUserId?: string;
  onDelete: (commentId: string) => Promise<void>;
}

export const CommentList = ({ comments, currentUserId, onDelete }: CommentListProps) => {
  const renderStars = (rating: number | null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => {
          const isActive = (rating || 0) >= value;
          return (
            <span
              key={value}
              className={isActive ? "text-yellow-400" : "text-muted-foreground"}
            >
              {isActive ? (
                <Star className="w-6 h-6 fill-current" />
              ) : (
                <StarOff className="w-6 h-6" />
              )}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {comments?.map((comment) => (
        <div key={comment.id} className="bg-muted p-3 rounded-lg space-y-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="font-medium">{comment.user_name}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(comment.created_at), "dd/MM/yyyy HH:mm")}
              </p>
              {renderStars(comment.rating)}
            </div>
            {currentUserId === comment.user_id && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(comment.id)}
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
  );
};