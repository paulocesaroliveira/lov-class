import { format } from "date-fns";
import { Loader2, IdCard } from "lucide-react";
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
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const handleVerifyDocument = async () => {
    try {
      // Get the document for this user's advertisement
      const { data: advertiserDocs, error: docsError } = await supabase
        .from('advertiser_documents')
        .select('*')
        .eq('advertisement_id', user.id)
        .single();

      if (docsError) {
        toast.error("Erro ao buscar documento");
        return;
      }

      if (!advertiserDocs) {
        toast.error("Nenhum documento encontrado para este usuário");
        return;
      }

      // Update the document as verified
      const { error: updateError } = await supabase
        .from('advertiser_documents')
        .update({ verified: true })
        .eq('id', advertiserDocs.id);

      if (updateError) {
        toast.error("Erro ao verificar documento");
        return;
      }

      toast.success("Documento verificado com sucesso");
    } catch (error) {
      console.error("Error verifying document:", error);
      toast.error("Erro ao verificar documento");
    }
  };

  return (
    <TableRow key={user.id}>
      <TableCell>{user.name}</TableCell>
      <TableCell>{getRoleLabel(user.role)}</TableCell>
      <TableCell>
        {format(new Date(user.created_at), "dd/MM/yyyy HH:mm")}
      </TableCell>
      <TableCell className="space-x-2">
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

        {user.role === 'advertiser' && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleVerifyDocument}
            className="ml-2"
          >
            <IdCard className="w-4 h-4 mr-2" />
            Verificar Documento
          </Button>
        )}
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