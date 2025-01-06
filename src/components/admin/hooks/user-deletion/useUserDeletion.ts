import { supabase } from "@/integrations/supabase/client";
import { DeletionProgress, DeletionResult } from "./types";
import { deleteUserRelatedData } from "./deleteUserRelatedData";
import { deleteUserProfile } from "./deleteUserProfile";
import { validateDeletion } from "./validations";
import { toast } from "sonner";

export const useUserDeletion = () => {
  const deleteUser = async (userId: string): Promise<DeletionResult> => {
    const logs: DeletionProgress[] = [];
    const logStep = (step: string, success: boolean, error?: string) => {
      console.log(`Delete user step: ${step}`, success ? "Success" : "Failed", error || "");
      logs.push({ step, success, error });
    };

    try {
      // Validate if deletion is allowed
      const validationResult = await validateDeletion(userId);
      if (!validationResult.success) {
        logStep("Validation", false, validationResult.error);
        return { success: false, error: validationResult.error, logs };
      }
      logStep("Validation", true);

      // Start transaction
      const { error: txError } = await supabase.rpc('begin_transaction');
      if (txError) throw new Error(`Transaction start failed: ${txError.message}`);
      logStep("Transaction Start", true);

      try {
        // Delete related data first
        await deleteUserRelatedData(userId, logStep);
        
        // Delete user profile
        await deleteUserProfile(userId, logStep);

        // Delete auth user
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);
        if (authError) throw new Error(`Auth user deletion failed: ${authError.message}`);
        logStep("Auth User Deletion", true);

        // Commit transaction
        const { error: commitError } = await supabase.rpc('commit_transaction');
        if (commitError) throw new Error(`Transaction commit failed: ${commitError.message}`);
        logStep("Transaction Commit", true);

        toast.success("Usuário excluído com sucesso");
        return { success: true, logs };
      } catch (error) {
        // Rollback on error
        const { error: rollbackError } = await supabase.rpc('rollback_transaction');
        if (rollbackError) {
          console.error("Rollback failed:", rollbackError);
        }
        throw error;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      logStep("Final", false, errorMessage);
      toast.error(`Erro ao excluir usuário: ${errorMessage}`);
      return { success: false, error: errorMessage, logs };
    }
  };

  return { deleteUser };
};