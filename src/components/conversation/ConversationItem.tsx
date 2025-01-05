import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
  id: string;
  otherParticipant: {
    user_id: string;
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
  onDelete,
}: ConversationItemProps) => {
  return (
    <Link to={`/mensagens/${id}`}>
      <Card className={cn(
        "p-4 hover:bg-black/5 transition-colors cursor-pointer",
        "border border-white/10 bg-black/20 backdrop-blur-sm"
      )}>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-primary">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${otherParticipant.user_id}`} />
            <AvatarFallback>
              {otherParticipant.profile_name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-white truncate">
                {otherParticipant.profile_name}
              </h3>
              <span className="text-xs text-white/60">
                {format(new Date(updatedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
              </span>
            </div>
            
            {lastMessage && (
              <p className="text-sm text-white/80 truncate mt-1">
                {lastMessage}
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};