import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { UserRole } from "../types";

interface RoleChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  newRole: UserRole | null;
  getRoleLabel: (role: UserRole) => string;
}

export const RoleChangeDialog = ({
  open,
  onOpenChange,
  onConfirm,
  newRole,
  getRoleLabel,
}: RoleChangeDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar alteração de papel</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja alterar o papel deste usuário para {newRole && getRoleLabel(newRole)}?
            Esta ação pode afetar as permissões do usuário no sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};