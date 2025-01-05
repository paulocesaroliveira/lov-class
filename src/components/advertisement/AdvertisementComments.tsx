import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { MessageCircle } from "lucide-react";
import { CommentForm } from "./comments/CommentForm";
import { CommentList } from "./comments/CommentList";
import { useComments } from "./comments/useComments";

type AdvertisementCommentsProps = {
  advertisementId: string;
};

export const AdvertisementComments = ({ advertisementId }: AdvertisementCommentsProps) => {
  const { session } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { comments, handleDelete, handleSubmit } = useComments(advertisementId);

  const onSubmit = async (comment: string, rating: number | null) => {
    if (!session) {
      return;
    }
    setIsSubmitting(true);
    await handleSubmit(session.user.id, comment, rating);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        Comentários
      </h3>

      <CommentForm
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        session={session}
      />

      <CommentList
        comments={comments || []}
        currentUserId={session?.user?.id}
        onDelete={handleDelete}
      />
    </div>
  );
};