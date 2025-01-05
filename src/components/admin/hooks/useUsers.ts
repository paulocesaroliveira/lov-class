import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile, AdminNote, UserActivityLog } from "../types";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

type UserRole = Database["public"]["Enums"]["user_role"];

export const useUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          admin_notes (
            id,
            note,
            created_at,
            created_by,
            updated_at,
            user_id
          ),
          user_activity_logs (
            id,
            action_type,
            description,
            created_at,
            created_by,
            metadata,
            user_id
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Type assertion to ensure the data matches our Profile type
      return (data as any[]).map(user => ({
        id: user.id,
        name: user.name,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
        admin_notes: user.admin_notes as AdminNote[],
        user_activity_logs: user.user_activity_logs as UserActivityLog[]
      })) as Profile[];
    },
  });
};

export const useUserActions = () => {
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;
      
      await supabase.from("user_activity_logs").insert({
        user_id: userId,
        action_type: "role_change",
        description: `Role changed to ${newRole}`,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      });

      toast.success("Papel do usuário atualizado com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao atualizar papel do usuário:", error);
      toast.error("Erro ao atualizar papel do usuário");
      return false;
    }
  };

  const handleAddNote = async (userId: string, noteContent: string) => {
    try {
      const { error } = await supabase.from("admin_notes").insert({
        user_id: userId,
        note: noteContent,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;
      toast.success("Nota adicionada com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao adicionar nota:", error);
      toast.error("Erro ao adicionar nota");
      return false;
    }
  };

  return {
    handleRoleChange,
    handleAddNote,
  };
};