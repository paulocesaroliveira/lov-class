import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { UserRole } from "./types";
import { useUsers } from "./hooks/useUsers";
import { useUserActions } from "./hooks/useUserActions";
import { UserFilters } from "./components/UserFilters";
import { UserTable } from "./components/UserTable";
import { UserPagination } from "./components/UserPagination";
import { RoleChangeDialog } from "./components/RoleChangeDialog";
import { useUserFilters } from "./hooks/useUserFilters";
import { useUserSort } from "./hooks/useUserSort";
import { useUserPagination } from "./hooks/useUserPagination";
import { ExportActions } from "./components/ExportActions";
import { UserMetricsDisplay } from "./components/UserMetricsDisplay";
import { RoleHistory } from "./components/RoleHistory";
import { useUserDeletion } from "./hooks/user-deletion/useUserDeletion";

export const UsersManagement = () => {
  const [updating, setUpdating] = useState<string | null>(null);
  const [roleChangeConfirm, setRoleChangeConfirm] = useState<{
    userId: string;
    newRole: UserRole;
  } | null>(null);

  const { 
    searchTerm, 
    setSearchTerm, 
    selectedRole, 
    setSelectedRole, 
    selectedDate, 
    setSelectedDate 
  } = useUserFilters();

  const { page, setPage, itemsPerPage } = useUserPagination();

  const { 
    data: usersData, 
    isLoading,
    isFetching
  } = useUsers({
    page,
    pageSize: itemsPerPage,
    searchTerm,
    role: selectedRole,
    date: selectedDate
  });

  const { handleRoleChange, handleAddNote } = useUserActions();
  const { deleteUser, deleteUserByName } = useUserDeletion();

  const { 
    sortColumn, 
    sortDirection, 
    handleSort, 
    sortedUsers 
  } = useUserSort(usersData?.data || []);

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "cliente":
        return "Cliente";
      case "anunciante":
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

  const handleUserDelete = async (userId: string) => {
    const success = await deleteUser(userId);
    if (success) {
      toast.success("Usuário excluído com sucesso");
    }
  };

  const confirmRoleChange = async () => {
    if (!roleChangeConfirm) return;
    
    setUpdating(roleChangeConfirm.userId);
    const success = await handleRoleChange(roleChangeConfirm.userId, roleChangeConfirm.newRole);
    if (success) {
      toast.success("Papel atualizado com sucesso");
    }
    setUpdating(null);
    setRoleChangeConfirm(null);
  };

  // Function to delete user by name
  const handleDeleteByName = async (name: string) => {
    const success = await deleteUserByName(name);
    if (success) {
      // The success toast is already handled in the hook
      // Refresh the users list
      window.location.reload();
    }
  };

  // Delete Fernanda immediately when component mounts
  useEffect(() => {
    handleDeleteByName("Fernanda");
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalPages = Math.ceil((usersData?.totalCount || 0) / itemsPerPage);

  return (
    <div className="space-y-8">
      <UserMetricsDisplay />
      
      <div className="space-y-4">
        <UserFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onExportData={() => <ExportActions />}
        />

        <UserTable
          users={sortedUsers}
          updating={updating}
          onRoleUpdate={handleRoleUpdate}
          onDeleteUser={handleUserDelete}
          onAddNote={handleAddNote}
          getRoleLabel={getRoleLabel}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          isLoading={isFetching}
        />

        <UserPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <RoleHistory />

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