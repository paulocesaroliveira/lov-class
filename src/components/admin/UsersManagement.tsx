import { useState } from "react";
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
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { format } from "date-fns";
import { UserRole, Profile } from "./types";
import { useUsers, useUserActions } from "./hooks/useUsers";
import { UserNotes } from "./components/UserNotes";
import { Loader2 } from "lucide-react";

export const UsersManagement = () => {
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [page, setPage] = useState(1);
  const [roleChangeConfirm, setRoleChangeConfirm] = useState<{
    userId: string;
    newRole: UserRole;
  } | null>(null);

  const itemsPerPage = 10;
  const { data: users, isLoading, refetch } = useUsers();
  const { handleRoleChange, handleAddNote } = useUserActions();

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

  const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
    setRoleChangeConfirm({ userId, newRole });
  };

  const confirmRoleChange = async () => {
    if (!roleChangeConfirm) return;
    
    setUpdating(roleChangeConfirm.userId);
    const success = await handleRoleChange(roleChangeConfirm.userId, roleChangeConfirm.newRole);
    if (success) refetch();
    setUpdating(null);
    setRoleChangeConfirm(null);
  };

  const handleNoteAdd = async (userId: string, note: string) => {
    const success = await handleAddNote(userId, note);
    if (success) refetch();
  };

  const filteredUsers = users?.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesDate = !selectedDate || format(new Date(user.created_at), "yyyy-MM-dd") === selectedDate;
    return matchesSearch && matchesRole && matchesDate;
  });

  const paginatedUsers = filteredUsers?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = filteredUsers ? Math.ceil(filteredUsers.length / itemsPerPage) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
            {paginatedUsers?.map((user) => (
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
                    onValueChange={(value: UserRole) => handleRoleUpdate(user.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      {updating === user.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <SelectValue />
                      )}
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
                      <Button variant="outline">
                        Ver Notas
                      </Button>
                    </DialogTrigger>
                    <UserNotes
                      userName={user.name}
                      notes={user.admin_notes}
                      onAddNote={(note) => handleNoteAdd(user.id, note)}
                    />
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => setPage(pageNum)}
                  isActive={page === pageNum}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <AlertDialog open={!!roleChangeConfirm} onOpenChange={() => setRoleChangeConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar alteração de papel</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja alterar o papel deste usuário para {roleChangeConfirm && getRoleLabel(roleChangeConfirm.newRole)}?
              Esta ação pode afetar as permissões do usuário no sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleChange}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};