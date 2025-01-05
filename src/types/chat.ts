export interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  conversation_id: string;
  read_at: string | null;
  sender: {
    name: string;
  } | null;
}

export interface ConversationParticipant {
  user_id: string;
  advertisement_id: string | null;
  advertisements?: {
    id: string;
    name: string;
    profile_id: string;
  } | null;
}

export interface ChatHeaderProps {
  title: string;
  className?: string;
}

export interface ChatInputProps {
  onSendMessage: (content: string) => Promise<void>;
  isBlocked: boolean;
  conversationId: string;
  className?: string;
}

export interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => Promise<any>;
}

export interface TypingIndicatorProps {
  conversationId: string;
  currentUserId: string;
  className?: string;
}

export interface NotificationButtonProps {
  className?: string;
}