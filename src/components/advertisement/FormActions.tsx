import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";

type FormActionsProps = {
  isLoading: boolean;
  isEditing: boolean;
};

export const FormActions = ({ isLoading, isEditing }: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-4 pt-6">
      <Button
        type="submit"
        className="relative overflow-hidden group"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Check className="w-4 h-4 mr-2" />
            {isEditing ? "Atualizar" : "Publicar"} Anúncio
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </Button>
    </div>
  );
};