import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatInputProps } from "@/types/chat";

export const ChatInput = ({ 
  onSendMessage, 
  isBlocked,
  conversationId,
  className 
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending || isBlocked) return;

    try {
      setIsSending(true);
      await onSendMessage(message);
      setMessage("");
    } finally {
      setIsSending(false);
    }
  };

  if (isBlocked) {
    return (
      <div className="p-4 bg-red-500/10 text-red-500 text-center">
        Você foi bloqueado e não pode enviar mensagens.
      </div>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "border-t border-white/10 p-4 bg-black/20",
        "transition-all duration-300 hover:bg-black/30",
        className
      )}
    >
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="min-h-[2.5rem] max-h-32 bg-black/20"
          disabled={isBlocked}
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={!message.trim() || isSending || isBlocked}
          className="shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};