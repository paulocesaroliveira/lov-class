import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, CheckCircle } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

type AdsTableProps = {
  advertisements: any[];
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onReview: (ad: any) => void;
  deleting: string | null;
};

export const AdsTable = ({
  advertisements,
  onDelete,
  onView,
  onReview,
  deleting,
}: AdsTableProps) => {
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
                <StatusBadge status={ad.advertisement_reviews?.[0]?.status || "pending"} />
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
                    onClick={() => onView(ad.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onReview(ad)}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
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