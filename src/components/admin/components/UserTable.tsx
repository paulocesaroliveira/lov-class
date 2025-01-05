import { format } from "date-fns";
import { Loader2, ArrowUpDown } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRole, Profile } from "../types";
import { UserNotes } from "./UserNotes";

interface UserTableProps {
  users: Profile[];
  updating: string | null;
  onRoleUpdate: (userId: string, newRole: UserRole) => void;
  onAddNote: (userId: string, note: string) => Promise<void>;
  getRoleLabel: (role: UserRole) => string;
  onSort: (column: keyof Profile) => void;
  sortColumn: keyof Profile | null;
  sortDirection: 'asc' | 'desc';
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
}: UserTableProps) => {
  const getSortIcon = (column: keyof Profile) => {
    if (sortColumn !== column) return <ArrowUpDown className="w-4 h-4 ml-1" />;
    return <ArrowUpDown className={`w-4 h-4 ml-1 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => onSort('name')}
                className="flex items-center hover:bg-transparent"
              >
                Nome
                {getSortIcon('name')}
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => onSort('role')}
                className="flex items-center hover:bg-transparent"
              >
                Papel
                {getSortIcon('role')}
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => onSort('created_at')}
                className="flex items-center hover:bg-transparent"
              >
                Data de Criação
                {getSortIcon('created_at')}
              </Button>
            </TableHead>
            <TableHead>Ações</TableHead>
            <TableHead>Notas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
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
                  onValueChange={(value: UserRole) => onRoleUpdate(user.id, value)}
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
                    <Button variant="outline">Ver Notas</Button>
                  </DialogTrigger>
                  <UserNotes
                    userName={user.name}
                    notes={user.admin_notes}
                    onAddNote={(note) => onAddNote(user.id, note)}
                  />
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};