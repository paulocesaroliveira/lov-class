import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  title: string;
  className?: string;
}

export const ChatHeader = ({ title, className }: ChatHeaderProps) => {
  return (
    <div className={cn(
      "p-4 border-b border-white/10 bg-black/20 backdrop-blur-sm",
      "transition-all duration-300 hover:bg-black/30",
      className
    )}>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
    </div>
  );
};