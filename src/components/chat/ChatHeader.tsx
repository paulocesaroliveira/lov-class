import { ChatHeaderProps } from "@/types/chat";

export const ChatHeader = ({ title }: ChatHeaderProps) => {
  return (
    <div className="p-4 border-b">
      <h1 className="text-xl font-semibold">
        Chat com {title}
      </h1>
    </div>
  );
};