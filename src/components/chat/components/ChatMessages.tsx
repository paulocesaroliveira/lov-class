import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessagesProps {
  messages: any[];
  isLoading: boolean;
  error: any;
  userId: string;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  className?: string;
}

export const ChatMessages = ({
  messages,
  isLoading,
  error,
  userId,
  onLoadMore,
  hasMore,
  isLoadingMore,
  className
}: ChatMessagesProps) => {
  const { ref, inView } = useInView();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inView && hasMore && !isLoadingMore) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoadingMore, onLoadMore]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 animate-pulse">
        <div className="space-y-4 w-full max-w-md">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/20" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-primary/20 rounded" />
                <div className="h-12 bg-primary/10 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-red-500 animate-fade-in">
        Erro ao carregar mensagens
      </div>
    );
  }

  return (
    <div className={cn("flex-1 overflow-y-auto p-4 space-y-4", className)}>
      {hasMore && (
        <div
          ref={ref}
          className="text-center p-2 text-sm text-muted-foreground animate-fade-in"
        >
          {isLoadingMore ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          ) : (
            "Carregue mais mensagens"
          )}
        </div>
      )}
      
      {messages?.map((message, index) => (
        <div
          key={message.id}
          className={cn(
            "flex animate-fade-in",
            message.sender_id === userId ? "justify-end" : "justify-start",
            // Add stagger effect
            `[animation-delay:${index * 50}ms]`
          )}
        >
          <div
            className={cn(
              "max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 sm:p-4 transition-all duration-300",
              message.sender_id === userId
                ? "bg-primary text-primary-foreground ml-4 sm:ml-12 hover:bg-primary/90"
                : "bg-black/20 text-white mr-4 sm:mr-12 hover:bg-black/30"
            )}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm sm:text-base font-medium">
                {message.sender?.name || "Usuário"}
              </span>
              <span className="text-xs sm:text-sm opacity-70">
                {format(new Date(message.created_at), "HH:mm", { locale: ptBR })}
              </span>
              {message.sender_id === userId && (
                <span className="ml-1 opacity-70 transition-opacity">
                  {message.read_at ? (
                    <CheckCheck size={16} className="text-blue-400" />
                  ) : (
                    <Check size={16} />
                  )}
                </span>
              )}
            </div>
            <p className="text-sm sm:text-base whitespace-pre-wrap break-words leading-relaxed">
              {message.content}
            </p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};