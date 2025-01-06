import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, CheckCircle, Ban, IdCard } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AdsTableProps = {
  advertisements: any[];
  onDelete: (id: string) => void;
  onBlock: (id: string) => void;
  onView: (ad: any) => void;
  onApprove: (ad: any) => void;
  onReview: (ad: any) => void;
  deleting: string | null;
};

export const AdsTable = ({
  advertisements,
  onDelete,
  onBlock,
  onView,
  onApprove,
  onReview,
  deleting,
}: AdsTableProps) => {
  const [loadingDoc, setLoadingDoc] = useState<string | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);

  const handleViewDocument = async (adId: string) => {
    setLoadingDoc(adId);
    try {
      const { data: advertiserDocs, error: docsError } = await supabase
        .from('advertiser_documents')
        .select('document_url')
        .eq('advertisement_id', adId)
        .single();

      if (docsError) {
        toast.error("Erro ao buscar documento");
        return;
      }

      if (!advertiserDocs) {
        toast.error("Nenhum documento encontrado para este anunciante");
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
      setLoadingDoc(null);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Anunciante</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead>Última Alteração</TableHead>
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
                <StatusBadge 
                  status={ad.advertisement_reviews?.[0]?.status || "pending"} 
                  blocked={ad.blocked}
                />
              </TableCell>
              <TableCell>
                {new Date(ad.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(ad.updated_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onView(ad)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onApprove(ad)}
                    className="text-green-500 hover:text-green-600"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onBlock(ad.id)}
                  >
                    <Ban className="h-4 w-4" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleViewDocument(ad.id)}
                        disabled={loadingDoc === ad.id}
                      >
                        <IdCard className="h-4 w-4" />
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
                  <Button
                    variant="destructive"
                    size="icon"
                    disabled={deleting === ad.id}
                    onClick={() => onDelete(ad.id)}
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
  );
};