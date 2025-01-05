import { format } from "date-fns";
import { Loader2 } from "lucide-react";
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
}

export const UserTable = ({
  users,
  updating,
  onRoleUpdate,
  onAddNote,
  getRoleLabel,
}: UserTableProps) => {
  return (
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