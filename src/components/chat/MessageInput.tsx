import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smile, Send } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MessageInputProps } from "@/types/chat";
import { useTypingStatus } from "./hooks/useTypingStatus";
import { useAuth } from "@/hooks/useAuth";
import { useUserBlock } from "@/hooks/useUserBlock";
import { toast } from "sonner";

let typingTimeout: NodeJS.Timeout;

export const MessageInput = ({ onSendMessage, conversationId }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const isMobile = useIsMobile();
  const { session } = useAuth();
  const { setTypingStatus } = useTypingStatus(conversationId, session?.user?.id);
  const { isBlocked, blockReason } = useUserBlock(session?.user?.id || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isBlocked) return;

    try {
      await onSendMessage(newMessage.trim());
      setNewMessage("");
      setIsTyping(false);
      setTypingStatus(false);
    } catch (error: any) {
      console.error("Error sending message:", error);
      
      if (error.message?.includes('Rate limit exceeded')) {
        toast.error("Você está enviando mensagens muito rápido. Por favor, aguarde um momento.");
      } else if (error.message?.includes('blocked')) {
        toast.error("Você foi bloqueado e não pode enviar mensagens.");
      } else {
        toast.error("Erro ao enviar mensagem. Tente novamente.");
      }
    }
  };

  const onEmojiClick = (emojiObject: any) => {
    setNewMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      setTypingStatus(true);
    }

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      setIsTyping(false);
      setTypingStatus(false);
    }, 2000);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(typingTimeout);
    };
  }, []);

  if (isBlocked) {
    return (
      <div className="p-4 bg-red-500/10 text-red-500 text-center">
        {blockReason || 'Você foi bloqueado e não pode enviar mensagens.'}
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 bg-black/10 backdrop-blur-sm border-t border-white/10">
      <form onSubmit={handleSubmit} className="flex gap-2 relative">
        <div className="relative flex-1">
          <Input
            value={newMessage}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="pr-10 py-6 sm:py-5 text-base bg-black/20 border-white/10 text-white placeholder:text-white/50"
            autoComplete="off"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-white/50 hover:text-white transition-colors p-2"
            >
              <Smile size={24} />
            </button>
          </div>
          {showEmojiPicker && (
            <div className={`absolute ${isMobile ? "bottom-full left-0" : "bottom-full right-0"} mb-2 emoji-picker-container z-50`}>
              <EmojiPicker 
                onEmojiClick={onEmojiClick}
                width={isMobile ? window.innerWidth - 32 : 320}
                height={isMobile ? 300 : 400}
              />
            </div>
          )}
        </div>
        <Button 
          type="submit" 
          size="lg" 
          className="bg-primary hover:bg-primary/90 text-base px-6 flex items-center gap-2"
          disabled={!newMessage.trim()}
        >
          <Send size={20} />
          <span>Enviar</span>
        </Button>
      </form>
    </div>
  );
};