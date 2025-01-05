import { MessageSquare } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-16rem)] space-y-4">
      <MessageSquare className="w-12 h-12 text-muted-foreground" />
      <div className="text-xl font-semibold text-muted-foreground">
        Nenhuma conversa encontrada
      </div>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        Quando você iniciar uma conversa com alguém, ela aparecerá aqui.
      </p>
    </div>
  );
};