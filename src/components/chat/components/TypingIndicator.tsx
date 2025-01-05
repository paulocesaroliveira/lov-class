import { cn } from "@/lib/utils";
import { useTypingStatus } from "../hooks/useTypingStatus";
import { TypingIndicatorProps } from "@/types/chat";

export const TypingIndicator = ({ 
  conversationId, 
  currentUserId,
  className 
}: TypingIndicatorProps) => {
  const { isTyping, typingUser } = useTypingStatus(conversationId, currentUserId);

  if (!isTyping || !typingUser) return null;

  return (
    <div className={cn("px-4 py-2 text-sm text-muted-foreground", className)}>
      <div className="flex items-center gap-2">
        <span>{typingUser.name} está digitando</span>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
};