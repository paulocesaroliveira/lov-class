import { MessageCircle } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-16rem)] text-center space-y-4">
      <MessageCircle className="h-16 w-16 text-primary/50" />
      <h2 className="text-2xl font-bold">Nenhuma conversa encontrada</h2>
      <p className="text-muted-foreground">
        Quando você iniciar uma conversa, ela aparecerá aqui
      </p>
    </div>
  );
};