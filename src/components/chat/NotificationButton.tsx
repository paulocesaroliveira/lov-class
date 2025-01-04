import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const NotificationButton = () => {
  const [notificationPermission, setNotificationPermission] = useState(
    Notification.permission
  );

  if (notificationPermission !== "default") return null;

  return (
    <div className="bg-primary/10 p-2 text-center">
      <p className="text-sm mb-2">
        Ative as notificações para receber alertas de novas mensagens
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          try {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);
            if (permission === "granted") {
              toast.success("Notificações ativadas com sucesso!");
            }
          } catch (error) {
            console.error("Erro ao solicitar permissão:", error);
            toast.error("Erro ao ativar notificações");
          }
        }}
        className="bg-primary/20 hover:bg-primary/30"
      >
        Ativar Notificações
      </Button>
    </div>
  );
};