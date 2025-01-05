import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./advertisementSchema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type TermsAndConditionsProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
};

export const TermsAndConditions = ({ form }: TermsAndConditionsProps) => {
  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="text-xl font-semibold">Termos e Condições</h2>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Para publicar seu anúncio, você precisa aceitar os termos e condições do site.
        </AlertDescription>
      </Alert>

      <FormField
        control={form.control}
        name="acceptTerms"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Eu li e aceito os termos e condições do site
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      <div className="prose prose-sm max-w-none">
        <h3>Termos de Uso</h3>
        <p>
          Ao utilizar nosso site, você concorda em cumprir e estar vinculado aos seguintes termos e condições:
        </p>
        <ul>
          <li>Você deve ter 18 anos ou mais para publicar anúncios.</li>
          <li>As informações fornecidas devem ser verdadeiras e precisas.</li>
          <li>Você é responsável pelo conteúdo do seu anúncio.</li>
          <li>Não é permitido conteúdo ilegal ou ofensivo.</li>
          <li>Reservamos o direito de remover anúncios que violem nossos termos.</li>
        </ul>
      </div>
    </div>
  );
};