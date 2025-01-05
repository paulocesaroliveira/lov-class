import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./advertisementSchema";
import InputMask from "react-input-mask";

type ContactLocationProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
};

export const ContactLocation = ({ form }: ContactLocationProps) => {
  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="text-xl font-semibold">Localização</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input 
                  placeholder="SP" 
                  {...field} 
                  maxLength={2} 
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    if (value.length <= 2) {
                      field.onChange(value);
                    }
                  }}
                  value={field.value.toUpperCase()}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input placeholder="São Paulo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input placeholder="Centro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};