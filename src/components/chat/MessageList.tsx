import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageListProps } from "@/types/chat";
import { Check, CheckCheck } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef } from "react";

export const MessageList = ({ 
  messages, 
  currentUserId,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage 
}: MessageListProps) => {
  const { ref, inView } = useInView();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 space-y-6 overflow-y-auto p-3 sm:p-4">
      {hasNextPage && (
        <div
          ref={ref}
          className="flex justify-center p-2 text-sm text-muted-foreground"
        >
          {isFetchingNextPage ? (
            "Carregando mensagens antigas..."
          ) : (
            "Carregue mais mensagens"
          )}
        </div>
      )}
      
      {messages?.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender_id === currentUserId ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 sm:p-4 ${
              message.sender_id === currentUserId
                ? "bg-primary text-primary-foreground ml-4 sm:ml-12"
                : "bg-black/20 text-white mr-4 sm:mr-12"
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm sm:text-base font-medium">
                {message.sender?.name || "Usuário"}
              </span>
              <span className="text-xs sm:text-sm opacity-70">
                {format(new Date(message.created_at), "HH:mm", { locale: ptBR })}
              </span>
              {message.sender_id === currentUserId && (
                <span className="ml-1 opacity-70">
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