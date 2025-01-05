import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ConversationItemProps {
  id: string;
  otherParticipant: {
    profile_name: string;
  };
  lastMessage: string | null;
  updatedAt: string;
  onDelete: () => void;
}

export const ConversationItem = ({
  id,
  otherParticipant,
  lastMessage,
  updatedAt,
  onDelete
}: ConversationItemProps) => {
  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("conversations")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting conversation:", error);
        toast.error("Erro ao deletar conversa");
        return;
      }

      toast.success("Conversa deletada com sucesso");
      onDelete();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao deletar conversa");
    }
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border hover:border-primary transition-colors bg-black/20 backdrop-blur-sm">
      <Link to={`/mensagens/${id}`} className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">
              {otherParticipant?.profile_name || "Usuário"}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {lastMessage || "Nenhuma mensagem"}
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            {format(new Date(updatedAt), "dd/MM/yyyy HH:mm", {
              locale: ptBR,
            })}
          </span>
        </div>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="ml-2 text-destructive hover:text-destructive/90"
        onClick={handleDelete}
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
};