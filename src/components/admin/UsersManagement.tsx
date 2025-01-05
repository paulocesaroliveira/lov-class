import { useState } from "react";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { UserRole } from "./types";
import { useUsers, useUserActions } from "./hooks/useUsers";
import { UserFilters } from "./components/UserFilters";
import { UserTable } from "./components/UserTable";
import { UserPagination } from "./components/UserPagination";
import { RoleChangeDialog } from "./components/RoleChangeDialog";
import { useUserFilters } from "./hooks/useUserFilters";
import { useUserSort } from "./hooks/useUserSort";
import { useUserPagination } from "./hooks/useUserPagination";
import { toast } from "sonner";

export const UsersManagement = () => {
  const [updating, setUpdating] = useState<string | null>(null);
  const [roleChangeConfirm, setRoleChangeConfirm] = useState<{
    userId: string;
    newRole: UserRole;
  } | null>(null);

  const { data: users, isLoading, refetch } = useUsers();
  const { handleRoleChange, handleAddNote } = useUserActions();

  const { 
    searchTerm, 
    setSearchTerm, 
    selectedRole, 
    setSelectedRole, 
    selectedDate, 
    setSelectedDate, 
    filteredUsers 
  } = useUserFilters(users);

  const { 
    sortColumn, 
    sortDirection, 
    handleSort, 
    sortedUsers 
  } = useUserSort(filteredUsers);

  const { 
    page, 
    setPage, 
    paginatedUsers, 
    totalPages 
  } = useUserPagination(sortedUsers);

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
        onAddNote={handleAddNote}
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

      <RoleChangeDialog
        open={!!roleChangeConfirm}
        onOpenChange={() => setRoleChangeConfirm(null)}
        onConfirm={confirmRoleChange}
        newRole={roleChangeConfirm?.newRole || null}
        getRoleLabel={getRoleLabel}
      />
    </div>
  );
};