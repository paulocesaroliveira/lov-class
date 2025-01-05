import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  admin_notes: Database["public"]["Tables"]["admin_notes"]["Row"][];
  user_activity_logs: Database["public"]["Tables"]["user_activity_logs"]["Row"][];
};

export const UsersManagement = () => {
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [noteContent, setNoteContent] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: users, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, user_activity_logs(*), admin_notes(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Profile[];
    },
  });

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      setUpdating(userId);
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;
      
      // Log the role change
      await supabase.from("user_activity_logs").insert({
        user_id: userId,
        action_type: "role_change",
        description: `Role changed to ${newRole}`,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      });

      toast.success("Papel do usuário atualizado com sucesso");
      refetch();
    } catch (error) {
      console.error("Erro ao atualizar papel do usuário:", error);
      toast.error("Erro ao atualizar papel do usuário");
    } finally {
      setUpdating(null);
    }
  };

  const handleAddNote = async (userId: string) => {
    try {
      const { error } = await supabase.from("admin_notes").insert({
        user_id: userId,
        note: noteContent,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;
      toast.success("Nota adicionada com sucesso");
      setNoteContent("");
      refetch();
    } catch (error) {
      console.error("Erro ao adicionar nota:", error);
      toast.error("Erro ao adicionar nota");
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "user":
        return "Cliente";
      case "advertiser":
        return "Anunciante";
      case "admin":
        return "Admin";
      default:
        return role;
    }
  };

  const filteredUsers = users?.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesDate = !selectedDate || format(new Date(user.created_at), "yyyy-MM-dd") === selectedDate;
    return matchesSearch && matchesRole && matchesDate;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 mb-4">
        <Input
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select value={selectedRole} onValueChange={(value: UserRole | "all") => setSelectedRole(value)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Filtrar role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="user">Cliente</SelectItem>
            <SelectItem value="advertiser">Anunciante</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead>Ações</TableHead>
              <TableHead>Notas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{getRoleLabel(user.role)}</TableCell>
                <TableCell>
                  {format(new Date(user.created_at), "dd/MM/yyyy HH:mm")}
                </TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    disabled={updating === user.id}
                    onValueChange={(value: UserRole) => handleRoleChange(user.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Cliente</SelectItem>
                      <SelectItem value="advertiser">Anunciante</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline"
                        onClick={() => setSelectedUserId(user.id)}
                      >
                        Ver Notas
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Notas Administrativas - {user.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          {user.admin_notes?.map((note) => (
                            <div key={note.id} className="p-2 border rounded">
                              <p className="text-sm">{note.note}</p>
                              <p className="text-xs text-gray-500">
                                {format(new Date(note.created_at), "dd/MM/yyyy HH:mm")}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Adicionar nova nota..."
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                          />
                          <Button 
                            onClick={() => handleAddNote(user.id)}
                            disabled={!noteContent.trim()}
                          >
                            Adicionar Nota
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};