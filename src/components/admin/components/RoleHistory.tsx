import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRoleHistory } from "../hooks/useRoleHistory";
import { Loader2 } from "lucide-react";

interface RoleHistoryProps {
  userId?: string;
}

export const RoleHistory = ({ userId }: RoleHistoryProps) => {
  const { data: history, isLoading } = useRoleHistory(userId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Histórico de Alterações de Papel</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Papel Anterior</TableHead>
            <TableHead>Novo Papel</TableHead>
            <TableHead>Alterado Por</TableHead>
            <TableHead>Motivo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {format(new Date(item.created_at), "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell>{item.old_role}</TableCell>
              <TableCell>{item.new_role}</TableCell>
              <TableCell>
                {item.changed_by_profile?.name || "Sistema"}
              </TableCell>
              <TableCell>{item.reason || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};