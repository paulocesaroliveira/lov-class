import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ActionDialogProps = {
  type: 'delete' | 'block' | null;
  adId: string | null;
  reason: string;
  onReasonChange: (reason: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ActionDialog = ({
  type,
  reason,
  onReasonChange,
  onConfirm,
  onCancel
}: ActionDialogProps) => {
  return (
    <AlertDialog open={type !== null} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {type === 'delete' ? 'Excluir Anúncio' : 'Bloquear Anúncio'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {type === 'delete' 
              ? 'Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.'
              : 'Tem certeza que deseja bloquear este anúncio? O anúncio não será mais visível para os usuários.'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <Label htmlFor="reason">Motivo</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Digite o motivo..."
            className="mt-2"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};