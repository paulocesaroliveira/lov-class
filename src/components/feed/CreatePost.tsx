import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { PostForm } from "./components/PostForm";
import { usePostCreation } from "./hooks/usePostCreation";

interface CreatePostProps {
  onPostCreated: () => void;
}

export const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const { session } = useAuth();
  const { isLoading, showDailyLimitError, handlePostCreation } = usePostCreation(onPostCreated);

  const handleSubmit = async (content: string, media: File[]) => {
    if (!session) {
      toast.error("Faça login para criar um post");
      return;
    }

    await handlePostCreation(content, media, session.user.id);
  };

  return (
    <div className="space-y-4">
      {showDailyLimitError && (
        <Alert variant="destructive">
          <AlertTitle>Limite Diário Atingido</AlertTitle>
          <AlertDescription>
            Você já fez uma publicação hoje. Para manter a qualidade do feed, 
            limitamos a uma publicação por dia. Tente novamente amanhã!
          </AlertDescription>
        </Alert>
      )}
      
      <PostForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};