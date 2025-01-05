import { useState } from "react";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
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
import { UserRole, Profile } from "./types";
import { useUsers, useUserActions } from "./hooks/useUsers";
import { UserFilters } from "./components/UserFilters";
import { UserTable } from "./components/UserTable";
import { UserPagination } from "./components/UserPagination";
import { toast } from "sonner";

export const UsersManagement = () => {
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [page, setPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof Profile | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
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

  const handleSort = (column: keyof Profile) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleExportData = () => {
    if (!filteredUsers?.length) {
      toast.error("Não há dados para exportar");
      return;
    }

    const headers = ["Nome", "Papel", "Data de Criação"];
    const csvContent = [
      headers.join(","),
      ...filteredUsers.map(user => [
        user.name,
        getRoleLabel(user.role),
        format(new Date(user.created_at), "dd/MM/yyyy HH:mm")
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `usuarios_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Dados exportados com sucesso");
  };

  const filteredUsers = users?.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesDate = !selectedDate || format(new Date(user.created_at), "yyyy-MM-dd") === selectedDate;
    return matchesSearch && matchesRole && matchesDate;
  });

  const sortedUsers = filteredUsers?.sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  const paginatedUsers = sortedUsers?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = sortedUsers ? Math.ceil(sortedUsers.length / itemsPerPage) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <UserFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onExportData={handleExportData}
      />

      <UserTable
        users={paginatedUsers || []}
        updating={updating}
        onRoleUpdate={handleRoleUpdate}
        onAddNote={handleNoteAdd}
        getRoleLabel={getRoleLabel}
        onSort={handleSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
      />

      <UserPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

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