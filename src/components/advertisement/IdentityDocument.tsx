import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./advertisementSchema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck } from "lucide-react";

type IdentityDocumentProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  setIdentityDocument: (file: File | null) => void;
};

export const IdentityDocument = ({ form, setIdentityDocument }: IdentityDocumentProps) => {
  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="text-xl font-semibold">Documento de Identidade</h2>
      
      <Alert>
        <ShieldCheck className="h-4 w-4" />
        <AlertDescription>
          Para mantermos um ambiente seguro e em conformidade com a legislação, precisamos de uma foto do seu documento de identidade.
          Este documento <strong>não será público</strong> e será usado apenas para verificação interna.
          Seus dados estão protegidos e só serão acessados por nossa equipe de moderação.
        </AlertDescription>
      </Alert>

      <FormField
        control={form.control}
        name="identityDocument"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormLabel>Documento de Identidade (RG ou CNH)</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setIdentityDocument(file);
                    onChange(file);
                  }
                }}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};