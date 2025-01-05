import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAdminRateLimit = () => {
  const [isChecking, setIsChecking] = useState(false);

  const checkRateLimit = async (actionType: string) => {
    try {
      setIsChecking(true);
      const { data: rateLimit, error } = await supabase
        .rpc('check_admin_rate_limit', {
          p_admin_id: (await supabase.auth.getUser()).data.user?.id,
          p_action_type: actionType,
          p_max_actions: 100,
          p_time_window: '1 hour'
        });

      if (error) throw error;

      if (!rateLimit) {
        toast.error('Limite de ações excedido. Tente novamente mais tarde.');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking rate limit:', error);
      toast.error('Erro ao verificar limite de ações');
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  return {
    isChecking,
    checkRateLimit
  };
};