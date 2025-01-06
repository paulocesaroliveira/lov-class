export interface DeletionProgress {
  step: string;
  success: boolean;
  error?: string;
}

export interface DeletionResult {
  success: boolean;
  error?: string;
  logs: DeletionProgress[];
}