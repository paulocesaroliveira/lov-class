export interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  conversation_id: string;
  read_at: string | null;
  sender?: {
    name: string | null;
  } | null;
}