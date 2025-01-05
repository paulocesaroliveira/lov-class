import { Loader2 } from "lucide-react";
import { Table, TableBody } from "@/components/ui/table";
import { UserRole, Profile } from "../types";
import { UserTableHeader } from "./UserTableHeader";
import { UserTableRow } from "./UserTableRow";

interface UserTableProps {
  users: Profile[];
  updating: string | null;
  onRoleUpdate: (userId: string, newRole: UserRole) => void;
  onAddNote: (userId: string, note: string) => Promise<boolean>;
  getRoleLabel: (role: UserRole) => string;
  onSort: (column: keyof Profile) => void;
  sortColumn: keyof Profile | null;
  sortDirection: 'asc' | 'desc';
  isLoading: boolean;
}

export const UserTable = ({
  users,
  updating,
  onRoleUpdate,
  onAddNote,
  getRoleLabel,
  onSort,
  sortColumn,
  sortDirection,
  isLoading,
}: UserTableProps) => {
  return (
    <div className="rounded-md border relative">
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
      <Table>
        <UserTableHeader
          onSort={onSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
        />
        <TableBody>
          {users?.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              updating={updating}
              onRoleUpdate={onRoleUpdate}
              onAddNote={onAddNote}
              getRoleLabel={getRoleLabel}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};