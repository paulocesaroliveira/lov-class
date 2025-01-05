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
import { TableCell, TableRow } from "@/components/ui/table";
import { UserRole, Profile } from "../types";
import { UserNotes } from "./UserNotes";

interface UserTableRowProps {
  user: Profile;
  updating: string | null;
  onRoleUpdate: (userId: string, newRole: UserRole) => void;
  onAddNote: (userId: string, note: string) => Promise<boolean>;
  getRoleLabel: (role: UserRole) => string;
}

export const UserTableRow = ({
  user,
  updating,
  onRoleUpdate,
  onAddNote,
  getRoleLabel,
}: UserTableRowProps) => {
  return (
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
  );
};