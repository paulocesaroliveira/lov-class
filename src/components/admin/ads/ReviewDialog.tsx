import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle } from "lucide-react";

type ReviewDialogProps = {
  selectedAd: any;
  reviewNotes: string;
  setReviewNotes: (notes: string) => void;
  onReview: (status: 'approved' | 'rejected') => void;
  onClose: () => void;
};

export const ReviewDialog = ({
  selectedAd,
  reviewNotes,
  setReviewNotes,
  onReview,
  onClose,
}: ReviewDialogProps) => {
  if (!selectedAd) return null;

  return (
    <Dialog open={!!selectedAd} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revisar Anúncio</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Anunciante</h3>
            <p className="text-sm text-muted-foreground">{selectedAd?.profiles?.name}</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Título do Anúncio</h3>
            <p className="text-sm text-muted-foreground">{selectedAd?.name}</p>
          </div>

          <div>
            <h3 className="font-medium mb-1">Notas da Revisão</h3>
            <Textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Adicione notas sobre a revisão (opcional)"
              className="h-32"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="destructive"
            onClick={() => onReview('rejected')}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Rejeitar
          </Button>
          <Button
            variant="default"
            onClick={() => onReview('approved')}
            className="bg-green-500 hover:bg-green-600"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Aprovar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};