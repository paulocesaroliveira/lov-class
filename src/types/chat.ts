export interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender?: {
    name: string;
  };
}