import { format } from "date-fns";
import { Loader2, IdCard } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface UserTableRowProps {
  user: Profile;
  updating: string | null;
  onRoleUpdate: (userId: string, newRole: UserRole) => void;
  onDeleteUser: (userId: string) => void;
  onAddNote: (userId: string, note: string) => Promise<boolean>;
  getRoleLabel: (role: UserRole) => string;
}

export const UserTableRow = ({
  user,
  updating,
  onRoleUpdate,
  onDeleteUser,
  onAddNote,
  getRoleLabel,
}: UserTableRowProps) => {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleViewDocument = async () => {
    setIsLoading(true);
    try {
      const { data: advertiserDocs, error: docsError } = await supabase
        .from('advertiser_documents')
        .select('document_url')
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

      const { data } = await supabase
        .storage
        .from('identity_documents')
        .getPublicUrl(advertiserDocs.document_url);

      setDocumentUrl(data.publicUrl);
    } catch (error) {
      console.error("Error fetching document:", error);
      toast.error("Erro ao buscar documento");
    } finally {
      setIsLoading(false);
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
            <SelectItem value="cliente">Cliente</SelectItem>
            <SelectItem value="anunciante">Anunciante</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>

        {user.role === "anunciante" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewDocument}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <IdCard className="w-4 h-4 mr-2" />
                )}
                Ver Documento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh]">
              {documentUrl && (
                <img 
                  src={documentUrl} 
                  alt="Documento de identidade"
                  className="w-full h-auto object-contain"
                />
              )}
            </DialogContent>
          </Dialog>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o usuário {user.name}? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDeleteUser(user.id)}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
