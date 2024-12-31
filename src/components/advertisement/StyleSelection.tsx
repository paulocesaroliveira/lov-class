import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./advertisementSchema";

type StyleSelectionProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
};

const styles = [
  { value: "patricinha", label: "Patricinha" },
  { value: "nerd", label: "Nerd" },
  { value: "passista", label: "Passista" },
  { value: "milf", label: "Milf" },
  { value: "fitness", label: "Fitness" },
  { value: "ninfeta", label: "Ninfeta" },
  { value: "gordelicia", label: "Gordelicia" },
] as const;

export const StyleSelection = ({ form }: StyleSelectionProps) => {
  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="text-xl font-semibold">Estilo</h2>
      <FormField
        control={form.control}
        name="style"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {styles.map((style) => (
                  <FormItem
                    key={style.value}
                    className="flex items-center space-x-3 space-y-0"
                  >
                    <FormControl>
                      <RadioGroupItem value={style.value} />
                    </FormControl>
                    <FormLabel className="font-normal">{style.label}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};