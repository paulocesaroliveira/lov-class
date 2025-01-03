import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

type StatusBadgeProps = {
  status: string;
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
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