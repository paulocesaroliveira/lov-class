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
import { Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export const AdsManagement = () => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState<string | null>(null);

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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", variant: "warning" },
      approved: { label: "Aprovado", variant: "success" },
      rejected: { label: "Rejeitado", variant: "destructive" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge variant={config.variant as "warning" | "success" | "destructive"}>
        {config.label}
      </Badge>
    );
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
                    onClick={() => navigate(`/editar-anuncio/${ad.id}`)}
                  >
                    <Eye className="h-4 w-4" />
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
  );
};