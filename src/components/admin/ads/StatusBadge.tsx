import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, XCircle, Ban } from "lucide-react";

type StatusBadgeProps = {
  status: string;
  blocked?: boolean;
};

export const StatusBadge = ({ status, blocked }: StatusBadgeProps) => {
  if (blocked) {
    return (
      <Badge variant="destructive">
        <Ban className="w-3 h-3 mr-1" />
        Bloqueado
      </Badge>
    );
  }

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