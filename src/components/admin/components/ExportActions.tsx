import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserRole } from "../types";

export const ExportActions = () => {
  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "user":
        return "Cliente";
      case "advertiser":
        return "Anunciante";
      case "admin":
        return "Admin";
      default:
        return role;
    }
  };

  const handleExportData = async () => {
    try {
      const { data: allUsers, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!allUsers?.length) {
        toast.error("Não há dados para exportar");
        return;
      }

      const headers = ["Nome", "Papel", "Data de Criação"];
      const csvContent = [
        headers.join(","),
        ...allUsers.map(user => [
          user.name,
          getRoleLabel(user.role as UserRole),
          format(new Date(user.created_at), "dd/MM/yyyy HH:mm")
        ].join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `usuarios_${format(new Date(), "yyyy-MM-dd")}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Dados exportados com sucesso");
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      toast.error("Erro ao exportar dados");
    }
  };

  return (
    <Button 
      variant="outline" 
      className="ml-auto"
      onClick={handleExportData}
    >
      <Download className="w-4 h-4 mr-2" />
      Exportar Dados
    </Button>
  );
};