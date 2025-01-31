import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./advertisementSchema";

type AppearanceProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
};

export const Appearance = ({ form }: AppearanceProps) => {
  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="text-xl font-semibold">Aparência</h2>

      <FormField
        control={form.control}
        name="ethnicity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Etnia</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua etnia" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="branca">Branca</SelectItem>
                <SelectItem value="negra">Negra</SelectItem>
                <SelectItem value="oriental">Oriental</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hair_color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cabelo</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a cor do cabelo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="morena">Morena</SelectItem>
                <SelectItem value="loira">Loira</SelectItem>
                <SelectItem value="ruiva">Ruiva</SelectItem>
                <SelectItem value="colorido">Colorido</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="body_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Corpo</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu tipo de corpo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="magra">Magra</SelectItem>
                <SelectItem value="gordinha">Gordinha</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="silicone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Silicone</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione onde usa silicone" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="nao_uso">Não uso</SelectItem>
                <SelectItem value="seios">Seios</SelectItem>
                <SelectItem value="bumbum">Bumbum</SelectItem>
                <SelectItem value="seios_e_bumbum">Seios e Bumbum</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};