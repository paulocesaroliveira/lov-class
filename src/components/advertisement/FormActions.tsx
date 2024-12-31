import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";

type FormActionsProps = {
  isLoading: boolean;
  isEditing: boolean;
};

export const FormActions = ({ isLoading, isEditing }: FormActionsProps) => {
  console.log("FormActions isEditing:", isEditing); // Debug log
  
  return (
    <Button type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isEditing ? "Atualizando anúncio..." : "Criando anúncio..."}
        </>
      ) : (
        <>
          <Upload className="mr-2 h-4 w-4" />
          {isEditing ? "Atualizar Anúncio" : "Criar Anúncio"}
        </>
      )}
    </Button>
  );
};