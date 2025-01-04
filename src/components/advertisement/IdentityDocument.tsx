import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./advertisementSchema";

type IdentityDocumentProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  setIdentityDocument: (file: File | null) => void;
};

export const IdentityDocument = ({ form, setIdentityDocument }: IdentityDocumentProps) => {
  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="text-xl font-semibold">Documento de Identidade</h2>
      <p className="text-sm text-muted-foreground">
        Para sua segurança e a dos usuários, precisamos de uma foto do seu documento de identidade.
        Este documento não será público e será usado apenas para verificação.
      </p>

      <FormField
        control={form.control}
        name="identityDocument"
        render={({ field: { onChange, ...field } }) => (
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
                    onChange(e);
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