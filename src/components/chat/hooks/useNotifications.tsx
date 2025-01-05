import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const DEFAULT_NOTIFICATION_SOUND = '/notification.mp3';

export const useNotifications = (conversationId: string, userId: string) => {
  const [notificationSound, setNotificationSound] = useState<HTMLAudioElement | null>(null);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  useEffect(() => {
    const audio = new Audio(DEFAULT_NOTIFICATION_SOUND);
    setNotificationSound(audio);

    // Verificar permissão inicial
    if (Notification.permission === 'granted') {
      setNotificationEnabled(true);
    }
  }, []);

  const playNotificationSound = () => {
    notificationSound?.play().catch(error => {
      console.error('Error playing notification sound:', error);
    });
  };

  const showNotification = async (message: { sender: { name: string }, content: string }) => {
    if (!notificationEnabled) return;

    try {
      // Mostrar notificação apenas se a janela estiver em segundo plano
      if (document.visibilityState === 'hidden') {
        const notification = new Notification(message.sender.name, {
          body: message.content,
          icon: '/favicon.ico',
          tag: conversationId, // Agrupa notificações da mesma conversa
          renotify: true
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        playNotificationSound();
      }
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  };

  const setupNotificationListener = () => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          if (payload.new && payload.new.sender_id !== userId) {
            const { data: senderData } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', payload.new.sender_id)
              .single();

            if (senderData) {
              showNotification({
                sender: { name: senderData.name },
                content: payload.new.content
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationEnabled(true);
        toast.success('Notificações ativadas com sucesso!');
        setupNotificationListener();
      } else {
        toast.error('Permissão para notificações negada');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Erro ao solicitar permissão para notificações');
    }
  };

  return {
    notificationEnabled,
    requestNotificationPermission
  };
};