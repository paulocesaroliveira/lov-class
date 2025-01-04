import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Message } from "@/types/chat";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  return (
    <div className="flex-1 space-y-6 overflow-y-auto p-3 sm:p-4">
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
                {message.profiles?.name || "Usuário"}
              </span>
              <span className="text-xs sm:text-sm opacity-70">
                {format(new Date(message.created_at), "HH:mm", { locale: ptBR })}
              </span>
            </div>
            <p className="text-sm sm:text-base whitespace-pre-wrap break-words leading-relaxed">
              {message.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};