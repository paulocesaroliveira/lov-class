import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./advertisementSchema";

type CustomRatesProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
};

export const CustomRates = ({ form }: CustomRatesProps) => {
  const customRates = form.watch("customRates");

  const addCustomRate = () => {
    if (customRates.length < 5) {
      form.setValue("customRates", [
        ...customRates,
        { description: "", value: 0 },
      ]);
    }
  };

  const removeCustomRate = (index: number) => {
    const newRates = customRates.filter((_, i) => i !== index);
    form.setValue("customRates", newRates);
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="text-xl font-semibold">Valores</h2>

      <FormField
        control={form.control}
        name="hourlyRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor da Hora</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="200"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Valores Personalizados</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCustomRate}
            disabled={customRates.length >= 5}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Valor
          </Button>
        </div>

        {customRates.map((_, index) => (
          <div key={index} className="flex gap-4 items-start">
            <FormField
              control={form.control}
              name={`customRates.${index}.description`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Pernoite" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`customRates.${index}.value`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="500"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-8"
              onClick={() => removeCustomRate(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};