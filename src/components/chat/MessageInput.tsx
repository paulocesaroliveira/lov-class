import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MessageInputProps } from "@/types/chat";

export const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await onSendMessage(newMessage.trim());
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const onEmojiClick = (emojiObject: any) => {
    setNewMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="p-2 sm:p-4 bg-black/10 backdrop-blur-sm border-t border-white/10">
      <form onSubmit={handleSubmit} className="flex gap-2 relative">
        <div className="relative flex-1">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="pr-10 py-6 sm:py-5 text-base bg-black/20 border-white/10 text-white placeholder:text-white/50"
          />
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2"
          >
            <Smile size={24} />
          </button>
          {showEmojiPicker && (
            <div className={`absolute ${isMobile ? "bottom-full left-0" : "bottom-full right-0"} mb-2`}>
              <EmojiPicker 
                onEmojiClick={onEmojiClick}
                width={isMobile ? window.innerWidth - 32 : 320}
                height={isMobile ? 300 : 400}
              />
            </div>
          )}
        </div>
        <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 text-base px-6">
          Enviar
        </Button>
      </form>
    </div>
  );
};