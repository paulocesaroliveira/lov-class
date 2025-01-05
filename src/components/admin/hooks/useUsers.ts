import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserRole, Profile } from "../types";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

export const useUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      // First, get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) {
        toast.error("Erro ao carregar usuários");
        throw profilesError;
      }

      // Then, get admin notes for all users
      const { data: adminNotes, error: adminNotesError } = await supabase
        .from("admin_notes")
        .select("*");

      if (adminNotesError) {
        toast.error("Erro ao carregar notas administrativas");
        throw adminNotesError;
      }

      // Get activity logs for all users
      const { data: activityLogs, error: logsError } = await supabase
        .from("user_activity_logs")
        .select("*");

      if (logsError) {
        toast.error("Erro ao carregar logs de atividade");
        throw logsError;
      }

      // Transform the data to match our Profile type
      const transformedData = profiles.map(profile => ({
        ...profile,
        admin_notes: adminNotes?.filter(note => note.user_id === profile.id) || [],
        user_activity_logs: activityLogs?.filter(log => log.user_id === profile.id) || []
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