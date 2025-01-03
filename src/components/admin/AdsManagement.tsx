import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, Trash2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export const AdsManagement = () => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  const { data: advertisements, refetch } = useQuery({
    queryKey: ["admin-advertisements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("advertisements")
        .select(`
          *,
          profiles (
            name,
            role
          ),
          advertisement_reviews (
            status,
            review_notes,
            updated_at
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      const { error } = await supabase
        .from("advertisements")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Anúncio excluído com sucesso");
      refetch();
    } catch (error) {
      console.error("Erro ao excluir anúncio:", error);
      toast.error("Erro ao excluir anúncio");
    } finally {
      setDeleting(null);
    }
  };

  const handleReview = async (status: 'approved' | 'rejected') => {
    if (!selectedAd) return;

    try {
      const { error } = await supabase
        .from("advertisement_reviews")
        .insert({
          advertisement_id: selectedAd.id,
          status,
          review_notes: reviewNotes,
          reviewer_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast.success(`Anúncio ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso`);
      setSelectedAd(null);
      setReviewNotes("");
      refetch();
    } catch (error) {
      console.error("Erro ao revisar anúncio:", error);
      toast.error("Erro ao revisar anúncio");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Aprovado
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rejeitado
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Anunciante</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {advertisements?.map((ad) => (
              <TableRow key={ad.id}>
                <TableCell>{ad.name}</TableCell>
                <TableCell>{ad.profiles?.name}</TableCell>
                <TableCell className="capitalize">{ad.category}</TableCell>
                <TableCell>
                  {getStatusBadge(ad.advertisement_reviews?.[0]?.status || "pending")}
                </TableCell>
                <TableCell>
                  {new Date(ad.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/anuncio/${ad.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedAd(ad)}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      disabled={deleting === ad.id}
                      onClick={() => handleDelete(ad.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedAd} onOpenChange={(open) => !open && setSelectedAd(null)}>
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
              onClick={() => handleReview('rejected')}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rejeitar
            </Button>
            <Button
              variant="default"
              onClick={() => handleReview('approved')}
              className="bg-green-500 hover:bg-green-600"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Aprovar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};