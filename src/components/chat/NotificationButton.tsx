import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { NotificationButtonProps } from "@/types/chat";
import { useNotifications } from "./hooks/useNotifications";

export const NotificationButton = ({ 
  className,
  conversationId,
  userId 
}: NotificationButtonProps) => {
  const { notificationEnabled, requestNotificationPermission } = useNotifications(
    conversationId,
    userId
  );

  if (notificationEnabled) return null;

  return (
    <div className={cn("bg-primary/10 p-2 text-center", className)}>
      <p className="text-sm mb-2">
        Ative as notificações para receber alertas de novas mensagens
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={requestNotificationPermission}
        className="bg-primary/20 hover:bg-primary/30"
      >
        Ativar Notificações
      </Button>
    </div>
  );
};