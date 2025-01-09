import { useState } from "react";
import { toast } from "sonner";

type ActionType = 'delete_user' | 'change_user_role' | 'add_user_note' | 'delete_advertisement' | 'block_advertisement';

export const useAdminRateLimit = () => {
  const [lastAction, setLastAction] = useState<{ type: ActionType; timestamp: number } | null>(null);

  const checkRateLimit = async (actionType: ActionType): Promise<boolean> => {
    const now = Date.now();
    const RATE_LIMIT_MS = 2000; // 2 seconds between actions

    if (lastAction && lastAction.type === actionType && now - lastAction.timestamp < RATE_LIMIT_MS) {
      toast.error("Por favor, aguarde alguns segundos antes de realizar esta ação novamente");
      return false;
    }

    setLastAction({ type: actionType, timestamp: now });
    return true;
  };

  return { checkRateLimit };
};