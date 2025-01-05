import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChatInputProps } from '../types';

export const ChatInput = ({ onSendMessage, isBlocked, conversationId }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isBlocked) return;

    await onSendMessage(message.trim());
    setMessage('');
  };

  const onEmojiClick = (emojiObject: any) => {
    setMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  if (isBlocked) {
    return (
      <div className="p-4 bg-red-500/10 text-red-500 text-center">
        Você foi bloqueado e não pode enviar mensagens.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
      <div className="flex gap-2 relative">
        <div className="relative flex-1">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Smile className="h-5 w-5" />
          </button>
          {showEmojiPicker && (
            <div className={`absolute ${isMobile ? 'bottom-full left-0' : 'bottom-full right-0'} mb-2`}>
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                width={isMobile ? window.innerWidth - 32 : 320}
                height={400}
              />
            </div>
          )}
        </div>
        <Button type="submit" disabled={!message.trim()}>
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};