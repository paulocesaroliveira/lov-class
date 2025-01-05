import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
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
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // altura estimada de cada linha
    overscan: 5,
  });

  return (
    <div 
      ref={parentRef} 
      className="rounded-md border relative max-h-[600px] overflow-auto"
    >
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-50">
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
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const user = users[virtualRow.index];
            return (
              <UserTableRow
                key={user.id}
                user={user}
                updating={updating}
                onRoleUpdate={onRoleUpdate}
                onAddNote={onAddNote}
                getRoleLabel={getRoleLabel}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};