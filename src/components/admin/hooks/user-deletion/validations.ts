import { supabase } from "@/integrations/supabase/client";

export const validateDeletion = async (userId: string) => {
  try {
    // Check if user exists
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileError) {
      return { success: false, error: "Usuário não encontrado" };
    }

    // Don't allow deleting other admins
    if (profile.role === "admin") {
      return { success: false, error: "Não é possível excluir outros administradores" };
    }

    // Check if current user is admin
    const { data: currentUser, error: currentUserError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", (await supabase.auth.getUser()).data.user?.id)
      .single();

    if (currentUserError || currentUser.role !== "admin") {
      return { success: false, error: "Apenas administradores podem excluir usuários" };
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erro na validação" 
    };
  }
};