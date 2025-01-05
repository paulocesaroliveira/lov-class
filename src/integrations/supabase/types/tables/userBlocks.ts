import { BlockReasonType } from '../enums';

export interface UserBlocksTable {
  Row: {
    id: string;
    blocked_user_id: string | null;
    blocked_by_id: string | null;
    reason: BlockReasonType;
    description: string | null;
    expires_at: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    blocked_user_id?: string | null;
    blocked_by_id?: string | null;
    reason: BlockReasonType;
    description?: string | null;
    expires_at?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    blocked_user_id?: string | null;
    blocked_by_id?: string | null;
    reason?: BlockReasonType;
    description?: string | null;
    expires_at?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
}