export interface ChatTables {
  messages: {
    Row: {
      id: string;
      conversation_id: string;
      sender_id: string;
      content: string;
      created_at: string;
      read_at: string | null;
    };
    Insert: {
      id?: string;
      conversation_id: string;
      sender_id: string;
      content: string;
      created_at?: string;
      read_at?: string | null;
    };
    Update: {
      id?: string;
      conversation_id?: string;
      sender_id?: string;
      content?: string;
      created_at?: string;
      read_at?: string | null;
    };
  };
  conversations: {
    Row: {
      id: string;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      created_at?: string;
      updated_at?: string;
    };
  };
  conversation_participants: {
    Row: {
      conversation_id: string;
      user_id: string;
      created_at: string;
      advertisement_id: string | null;
    };
    Insert: {
      conversation_id: string;
      user_id: string;
      created_at?: string;
      advertisement_id?: string | null;
    };
    Update: {
      conversation_id?: string;
      user_id?: string;
      created_at?: string;
      advertisement_id?: string | null;
    };
  };
  user_typing_status: {
    Row: {
      conversation_id: string;
      user_id: string;
      is_typing: boolean | null;
      updated_at: string | null;
    };
    Insert: {
      conversation_id: string;
      user_id: string;
      is_typing?: boolean | null;
      updated_at?: string | null;
    };
    Update: {
      conversation_id?: string;
      user_id?: string;
      is_typing?: boolean | null;
      updated_at?: string | null;
    };
  };
}