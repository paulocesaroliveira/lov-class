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
  } | null;
}

export interface ChatHeaderProps {
  title: string;
}

export interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  conversationId: string;
}

export interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
}