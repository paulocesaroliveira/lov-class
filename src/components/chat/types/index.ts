import { Message } from "@/types/chat";

export interface ChatProps {
  conversationId: string;
  userId: string;
}

export interface ChatContentState {
  isLoading: boolean;
  error: Error | null;
  messages: Message[];
}

export interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  userId: string;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
}

export interface ChatInputProps {
  onSendMessage: (content: string) => Promise<void>;
  isBlocked: boolean;
  conversationId: string;
}

export interface ChatHeaderProps {
  title: string;
  participantId?: string;
}

export interface UseMessagesReturn {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMore: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
}