import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserRole, Profile } from "../types";
import { toast } from "sonner";

interface UsersQueryParams {
  page: number;
  pageSize: number;
  searchTerm?: string;
  role?: UserRole | "all";
  date?: string;
}

interface UsersResponse {
  data: Profile[];
  totalCount: number;
}

export const useUsers = (params: UsersQueryParams) => {
  const { page, pageSize, searchTerm, role, date } = params;

  return useQuery<UsersResponse>({
    queryKey: ["admin-users", params],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select("*, admin_notes(*), user_activity_logs(*)", { count: "exact" });

      // Apply filters
      if (searchTerm) {
        query = query.ilike("name", `%${searchTerm}%`);
      }
      if (role && role !== "all") {
        query = query.eq("role", role);
      }
      if (date) {
        query = query.gte("created_at", `${date}T00:00:00`)
          .lte("created_at", `${date}T23:59:59`);
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data: profiles, error: profilesError, count } = await query;

      if (profilesError) {
        toast.error("Erro ao carregar usuários");
        throw profilesError;
      }

      return {
        data: profiles as unknown as Profile[],
        totalCount: count || 0,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
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
      return true;
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
        return await addNoteMutation.mutateAsync({ userId, note });
      } catch {
        return false;
      }
    },
  };
};