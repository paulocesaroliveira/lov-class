import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserRole, Profile } from "../types";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

export const useUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          admin_notes:admin_notes(
            id,
            note,
            created_at,
            created_by,
            updated_at,
            user_id
          ),
          user_activity_logs:user_activity_logs(
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

      if (error) {
        toast.error("Erro ao carregar usuários");
        throw error;
      }

      // Transform the data to match our Profile type
      const transformedData = data?.map(user => ({
        ...user,
        admin_notes: user.admin_notes || [],
        user_activity_logs: user.user_activity_logs || []
      })) as Profile[];

      return transformedData;
    },
  });
};

export const useUserActions = () => {
  const queryClient = useQueryClient();

  const roleChangeMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: UserRole }) => {
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Papel do usuário atualizado com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao atualizar papel do usuário:", error);
      toast.error("Erro ao atualizar papel do usuário");
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async ({ userId, note }: { userId: string; note: string }) => {
      const { error } = await supabase.from("admin_notes").insert({
        user_id: userId,
        note,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Nota adicionada com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao adicionar nota:", error);
      toast.error("Erro ao adicionar nota");
    },
  });

  return {
    handleRoleChange: async (userId: string, newRole: UserRole) => {
      try {
        await roleChangeMutation.mutateAsync({ userId, newRole });
        return true;
      } catch {
        return false;
      }
    },
    handleAddNote: async (userId: string, note: string) => {
      try {
        await addNoteMutation.mutateAsync({ userId, note });
        return true;
      } catch {
        return false;
      }
    },
  };
};