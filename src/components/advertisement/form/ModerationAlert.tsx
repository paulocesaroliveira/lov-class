import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

interface ModerationAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ModerationAlert = ({ open, onOpenChange }: ModerationAlertProps) => {
  const navigate = useNavigate();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Anúncio Enviado para Moderação</AlertDialogTitle>
          <AlertDialogDescription>
            Seu anúncio foi criado com sucesso e está em análise. 
            Ele será publicado após aprovação da moderação.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => {
            onOpenChange(false);
            navigate("/anuncios");
          }}>
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};